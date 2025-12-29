import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { ArrowRight, Calendar, Users, Zap, Shield, Sparkles } from 'lucide-react';

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { events } = useEvents();

  const featuredEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Discover Amazing Events Near You
            </div>
            
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Create, Discover &{' '}
              <span className="text-gradient">Connect</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Your all-in-one platform for hosting and attending memorable events. 
              From tech meetups to art exhibitions, find your next experience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/events">
                <Button size="lg" className="h-14 px-8 text-base gradient-primary hover:opacity-90 transition-opacity shadow-lg hover:shadow-glow">
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base border-2">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-foreground">10k+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to host and attend amazing events, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: 'Easy Event Creation',
                description: 'Create events in minutes with our intuitive form. Add images, set capacity, and publish instantly.',
              },
              {
                icon: Users,
                title: 'Smart RSVP System',
                description: 'Real-time capacity tracking with concurrency handling. No overbooking, ever.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized performance for quick loading and smooth user experience.',
              },
              {
                icon: Shield,
                title: 'Secure & Reliable',
                description: 'JWT authentication and secure data handling to keep your events safe.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Don't miss out on these popular events
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-card rounded-3xl p-8 md:p-12 border border-border shadow-xl">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Host Your Event?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of event organizers who trust EventHub for their events. 
              Create your first event today and start building your community.
            </p>
            {isAuthenticated ? (
              <Link to="/create-event">
                <Button size="lg" className="h-14 px-8 gradient-primary hover:opacity-90 transition-opacity">
                  Create Your Event
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" className="h-14 px-8 gradient-primary hover:opacity-90 transition-opacity">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
