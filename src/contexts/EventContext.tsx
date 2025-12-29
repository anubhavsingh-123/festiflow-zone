import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  imageUrl: string;
  creatorId: string;
  creatorName: string;
  attendees: string[];
  category: string;
  createdAt: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'attendees' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  rsvpToEvent: (eventId: string, userId: string) => { success: boolean; message: string };
  cancelRsvp: (eventId: string, userId: string) => void;
  getEventById: (id: string) => Event | undefined;
  getUserEvents: (userId: string) => Event[];
  getUserRsvps: (userId: string) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Mock initial events
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join us for an exciting day of tech talks, workshops, and networking with industry leaders. Learn about the latest trends in AI, blockchain, and cloud computing.',
    date: '2025-01-15',
    time: '09:00',
    location: 'Convention Center, San Francisco',
    capacity: 500,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    creatorId: '1',
    creatorName: 'TechOrg',
    attendees: ['user1', 'user2', 'user3'],
    category: 'Technology',
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    title: 'Music in the Park',
    description: 'A beautiful evening of live music under the stars. Featuring local bands and artists performing a variety of genres from jazz to indie rock.',
    date: '2025-01-20',
    time: '18:00',
    location: 'Central Park Amphitheater',
    capacity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    creatorId: '2',
    creatorName: 'MusicLovers',
    attendees: ['user1'],
    category: 'Music',
    createdAt: '2024-12-05',
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    description: 'Watch 10 innovative startups pitch their ideas to a panel of investors. Great networking opportunity for entrepreneurs and investors alike.',
    date: '2025-01-25',
    time: '19:00',
    location: 'Innovation Hub, Downtown',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    creatorId: '3',
    creatorName: 'StartupCommunity',
    attendees: [],
    category: 'Business',
    createdAt: '2024-12-10',
  },
  {
    id: '4',
    title: 'Yoga & Wellness Retreat',
    description: 'A full day of relaxation, meditation, and yoga sessions led by certified instructors. Healthy lunch included.',
    date: '2025-02-01',
    time: '07:00',
    location: 'Serenity Resort & Spa',
    capacity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
    creatorId: '1',
    creatorName: 'WellnessGroup',
    attendees: ['user2', 'user3'],
    category: 'Health',
    createdAt: '2024-12-12',
  },
  {
    id: '5',
    title: 'Art Gallery Opening',
    description: 'Exclusive opening night for the new contemporary art exhibition featuring works from emerging artists around the world.',
    date: '2025-02-10',
    time: '17:00',
    location: 'Modern Art Museum',
    capacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    creatorId: '2',
    creatorName: 'ArtCollective',
    attendees: ['user1', 'user2'],
    category: 'Art',
    createdAt: '2024-12-15',
  },
  {
    id: '6',
    title: 'Food & Wine Festival',
    description: 'Sample cuisines from 30+ local restaurants and taste wines from renowned vineyards. Live cooking demonstrations throughout the day.',
    date: '2025-02-15',
    time: '12:00',
    location: 'Riverside Plaza',
    capacity: 300,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    creatorId: '3',
    creatorName: 'FoodieNetwork',
    attendees: ['user1', 'user2', 'user3'],
    category: 'Food',
    createdAt: '2024-12-18',
  },
];

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = (eventData: Omit<Event, 'id' | 'attendees' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      attendees: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...eventData } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const rsvpToEvent = (eventId: string, userId: string) => {
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    if (event.attendees.includes(userId)) {
      return { success: false, message: 'You have already RSVP\'d to this event' };
    }

    if (event.attendees.length >= event.capacity) {
      return { success: false, message: 'Event is at full capacity' };
    }

    // Simulate atomic update with concurrency check
    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          // Double check capacity before adding
          if (e.attendees.length >= e.capacity) {
            return e;
          }
          return { ...e, attendees: [...e.attendees, userId] };
        }
        return e;
      })
    );

    return { success: true, message: 'Successfully RSVP\'d to event!' };
  };

  const cancelRsvp = (eventId: string, userId: string) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, attendees: event.attendees.filter(id => id !== userId) }
          : event
      )
    );
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getUserEvents = (userId: string) => {
    return events.filter(event => event.creatorId === userId);
  };

  const getUserRsvps = (userId: string) => {
    return events.filter(event => event.attendees.includes(userId));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        rsvpToEvent,
        cancelRsvp,
        getEventById,
        getUserEvents,
        getUserRsvps,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
