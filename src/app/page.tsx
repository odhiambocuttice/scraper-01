// "use client"

// import { useState } from 'react'
// import Image from 'next/image'
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Heart, Plus } from 'lucide-react'
// import eventsData from '../../public/data/events.json'

// export default function EventsPage() {
//   const [nameFilter, setNameFilter] = useState('')
//   const [dateFilter, setDateFilter] = useState('')
//   const [locationFilter, setLocationFilter] = useState('all')
//   const [events, setEvents] = useState(eventsData)

//   const filteredEvents = events.filter(event =>
//     event.eventName.toLowerCase().includes(nameFilter.toLowerCase()) &&
//     event.date.includes(dateFilter) &&
//     (locationFilter === 'all' || event.location.toLowerCase() === locationFilter.toLowerCase())
//   )

//   const uniqueLocations = Array.from(new Set(events.map(event => event.location)))

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="mx-auto p-8">
//         <h1 className="text-4xl md:text-6xl font-light mb-12">Discover Kenya&apos;s Events</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//           <div className="space-y-3">
//             <Label htmlFor="name-filter" className="text-lg">Event Name</Label>
//             <Input
//               id="name-filter"
//               placeholder="Filter by name"
//               value={nameFilter}
//               onChange={(e) => setNameFilter(e.target.value)}
//               className="bg-secondary/50 border-secondary h-12 text-lg rounded-2xl"
//             />
//           </div>
//           <div className="space-y-3">
//             <Label htmlFor="date-filter" className="text-lg">Date</Label>
//             <Input
//               id="date-filter"
//               placeholder="Filter by date"
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//               className="bg-secondary/50 border-secondary h-12 text-lg rounded-2xl"
//             />
//           </div>
//           <div className="space-y-3">
//             <Label htmlFor="location-filter" className="text-lg">Location</Label>
//             <Select value={locationFilter} onValueChange={setLocationFilter}>
//               <SelectTrigger id="location-filter" className="bg-secondary/50 border-secondary h-12 text-lg rounded-2xl">
//                 <SelectValue placeholder="Filter by location" />
//               </SelectTrigger>
//               <SelectContent className="rounded-2xl">
//                 <SelectItem value="all">All Locations</SelectItem>
//                 {uniqueLocations.map(location => (
//                   <SelectItem key={location} value={location}>{location}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[300px]">
//           {filteredEvents.map((event, index) => (
//             <div
//               key={index}
//               className={`relative group cursor-pointer overflow-hidden rounded-3xl bg-secondary/50
//                 ${index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}
//               `}
//             >
//               <Image
//                 src={event.photoLink}
//                 alt={event.eventName}
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-110"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 unoptimized
//               />
//               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               <div className="absolute top-6 right-6 flex gap-3">
//                 <button className="p-3 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors">
//                   <Heart className="w-6 h-6" />
//                 </button>
//                 <button className="p-3 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors">
//                   <Plus className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
//                 <h2 className="text-2xl font-light mb-2">{event.eventName}</h2>
//                 <p className="text-lg text-primary/80 font-light">{event.date}</p>
//                 <p className="text-lg text-primary/80 font-light">{event.location}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Plus } from 'lucide-react'
import eventsData from '../../public/data/events.json'

export default function EventsPage() {
  const [nameFilter, setNameFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [events, setEvents] = useState(eventsData)

  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(nameFilter.toLowerCase()) &&
    event.date.includes(dateFilter) &&
    (locationFilter === 'all' || event.location.toLowerCase() === locationFilter.toLowerCase())
  )

  const uniqueLocations = Array.from(new Set(events.map(event => event.location)))

  // Modified size distribution to better fill space
  const getRandomSize = (index: any, totalEvents: any) => {
    // Ensure larger tiles are distributed evenly
    if (index % 6 === 0) {
      return 'row-span-2 col-span-2'
    } else if (index % 3 === 0) {
      return 'row-span-2 col-span-1'
    } else if (index % 4 === 0) {
      return 'row-span-1 col-span-2'
    }
    return 'row-span-1 col-span-1'
  };

  // Generate sizes based on event position
  const eventSizes = filteredEvents.map((_, index) =>
    getRandomSize(index, filteredEvents.length)
  );

  async function handleOnClick() {
    const response = await fetch('/api/scraper', {
      method: 'POST',
      // body: JSON.stringify({ message: 'Hello World!' }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
    setEvents(response);
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl md:text-6xl font-light mb-12">Discover Kenya&apos;s Events</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <p className="mb-6">
            <button className="btn btn-primary" onClick={handleOnClick}>Get Started</button>
          </p>
          <div className="space-y-3">
            <Label htmlFor="name-filter" className="text-lg">Event Name</Label>
            <Input
              id="name-filter"
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="bg-secondary/50 border-secondary h-12 text-lg rounded-2xl"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="date-filter" className="text-lg">Date</Label>
            <Input
              id="date-filter"
              placeholder="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-secondary/50 border-secondary h-12 text-lg rounded-2xl"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="location-filter" className="text-lg">Location</Label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger id="location-filter" className="bg-secondary/50 border-secondary h-12 text-lg rounded-2xl">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Modified grid container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] mx-auto">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer overflow-hidden rounded-3xl bg-secondary/50 ${eventSizes[index]}`}
              style={{
                opacity: 1,
                transform: 'none'
              }}
            >
              <a href={event.eventLink} target="_blank" rel="noopener noreferrer">
                <Image
                  src={event.photoLink}
                  alt={event.eventName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-xl font-light mb-1">{event.eventName}</h2>
                  <p className="text-sm text-primary/80 font-light">{event.date}</p>
                  <p className="text-sm text-primary/80 font-light">{event.location}</p>
                </div>
              </a>
            </div>

          ))}
        </div>
      </div>
    </div>
  )
}
