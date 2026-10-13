export const PHONE_DISPLAY = '011 365 5764'
export const PHONE_HREF = 'tel:+27113655764'

export const EVENTS = [
  {
    id: 'science',
    title: 'Science model building competition',
    image: 'event1.jpg',
    alt: 'A young girl working on a science project',
  },
  {
    id: 'book-launch',
    title: "Sharon's book launch and love conversations",
    image: 'event2.jpeg',
    alt: "Poster text: Sharon's Book launch and love conversations",
  },
]

export const TEAM = [
  { id: 'director', role: 'Library Director', name: 'Cynthia Khubeka', image: 'librarian1.jpg' },
  { id: 'assistant', role: 'Assistant to Director', name: 'Tyrique Feldman', image: 'librarian2.jpg' },
  { id: 'technician', role: 'Library Technician', name: 'Dimpho Mofokeng', image: 'librarian3.jpg' },
]

export const ROOMS = [
  { value: 'room-1', label: 'Room 1' },
  { value: 'room-2', label: 'Room 2' },
  { value: 'room-3', label: 'Room 3' },
]

export const imgSrc = (file) => `${import.meta.env.BASE_URL}images/${file}`