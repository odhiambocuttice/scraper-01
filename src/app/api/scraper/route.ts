import puppeteer from "puppeteer";
import { convert } from 'html-to-text';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { JSDOM } from 'jsdom';


async function fetchHTMLPuppeteer(url: string): Promise<string> {
    if (typeof window !== 'undefined') {
        throw new Error('Puppeteer can only be run on the server side');
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-gpu',
            '--disable-extensions',
        ],
        // executablePath: process.env.CHROME_EXECUTABLE_PATH,
    });

    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 100000 });

        // Handle potential "Accept Cookies" banners
        const acceptTextVariations = ["accept", "agree", "allow", "consent", "continue", "ok", "I agree", "got it"];
        for (const text of acceptTextVariations) {
            try {
                const found = await page.evaluate((buttonText) => {
                    const elements = Array.from(document.querySelectorAll('button, a, div'));
                    const button = elements.find(
                        (el) =>
                            el.textContent &&
                            el.textContent.toLowerCase().includes(buttonText.toLowerCase())
                    );
                    if (button) {
                        (button as HTMLElement).click();
                        return true;
                    }
                    return false;
                }, text);

                if (found) {
                    console.log(`Clicked the '${text}' button.`);
                    break;
                }
            } catch (e: any) {
                console.error(`Error clicking button with text '${text}':`, e.message);
            }
        }

        // Scroll to load dynamic content
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Pause for 2 seconds

        return await page.content();
    } finally {
        await browser.close();
    }
}

function cleanHTML(htmlContent: string): string {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Remove unnecessary elements like headers and footers
    document.querySelectorAll("header, footer").forEach((el) => el.remove());

    return document.body.innerHTML;
}

function htmlToMarkdown(cleanedHtml: string): string {
    return convert(cleanedHtml, {
        wordwrap: 80,
        // @ts-ignore
        ignoreHref: false,
        ignoreImage: false,
    });
}

function generateDynamicListingSchema(fieldNames: string[]): Record<string, any> {
    const schema: Record<string, string> = {};
    fieldNames.forEach((field) => {
        schema[field] = 'string'; // All fields are treated as strings
    });
    return schema;
}

// Function to generate a system message
function generateSystemMessage(fieldNames: string[]): string {
    const schema = generateDynamicListingSchema(fieldNames);
    const schemaStructure = Object.entries(schema)
        .map(([key, type]) => `"${key}": "${type}"`)
        .join(',\n');

    return `
    You are an intelligent text extraction and conversion assistant. Your task is to extract structured information 
    from the given text and convert it into a pure JSON format. The JSON should contain only the structured data extracted from the text, 
    with no additional commentary, explanations, or extraneous information. When the text has ellipsis, find the full text. The locations of the events should be in Kenya only.
    Make sure the photo links are valid.
    You could encounter cases where you can't find the data of the fields you have to extract or the data will be in a foreign language.
    Please process the following text and provide the output in pure JSON format with no words before or after the JSON:
    Please ensure the output strictly follows this schema:

    {
        "listings": [
            {
                ${schemaStructure}
            }
        ]
    }
    `;
}

async function processDataWithGroq(content: string, fieldNames: string[]): Promise<any> {
    const client = new Groq({ apiKey: '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' });
    const systemMessage = generateSystemMessage(fieldNames);

    const response = await client.chat.completions.create({
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content },
        ],
        model: 'llama-3.1-70b-versatile',
    });

    const responseContent: any = response.choices[0].message.content;
    return JSON.parse(responseContent); // Assuming Groq returns JSON as a string
}


export async function POST() {
    const url = 'https://kenyabuzz.com/events/month/january'; // Target URL
    const fieldNames = ['eventName', 'date', 'location', 'description', 'photoLink']; // Fields to extract

    try {
        const rawHtml = await fetchHTMLPuppeteer(url);
        const cleanedHtml = cleanHTML(rawHtml);
        const newMd = htmlToMarkdown(cleanedHtml);

        // Process data with Groq
        const extractedData = await processDataWithGroq(newMd, fieldNames);

        console.log('Extracted Data:', JSON.stringify(extractedData, null, 2));
        return NextResponse.json(extractedData);
    } catch (error: any) {
        console.error('Error during processing:', error.message);
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
    }
}