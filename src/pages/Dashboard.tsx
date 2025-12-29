import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { Plus, Calendar, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserEvents, getUserRsvps } = useEvents();

  const myEvents = getUserEvents(user?.id || '');
  const myRsvps = getUserRsvps(user?.id || '');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and RSVPs</p>
          </div>
          <Link to="/create-event">
            <Button className="mt-4 md:mt-0 gradient-primary">
              <Plus className="w-4 h-4 mr-2" /> Create Event
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{myEvents.length}</p>
                <p className="text-muted-foreground text-sm">Events Created</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{myRsvps.length}</p>
                <p className="text-muted-foreground text-sm">Events Attending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="created" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="created">My Events</TabsTrigger>
            <TabsTrigger value="attending">Attending</TabsTrigger>
          </TabsList>
          <TabsContent value="created">
            {myEvents.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            ) : (
              <Card><CardContent className="p-12 text-center text-muted-foreground">No events created yet</CardContent></Card>
            )}
          </TabsContent>
          <TabsContent value="attending">
            {myRsvps.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRsvps.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            ) : (
              <Card><CardContent className="p-12 text-center text-muted-foreground">Not attending any events yet</CardContent></Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
