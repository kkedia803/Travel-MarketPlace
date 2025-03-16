import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'About Us | TracoIt',
  description: 'Learn about our mission, values, and the team behind TracoIt',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">About TracoIt</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting travelers with unique experiences and local travel providers around the world.
        </p>
      </section>
      
      {/* Our Story */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-lg text-muted-foreground">
            TracoIt was founded in 2023 with a simple mission: to make unique travel experiences accessible to everyone while supporting local travel providers.
          </p>
          <p className="text-lg text-muted-foreground">
            What started as a small platform connecting travelers with local guides has grown into a global marketplace where travelers can discover and book authentic experiences directly from local experts.
          </p>
          <p className="text-lg text-muted-foreground">
            Today, we're proud to host thousands of travel packages from providers across the globe, helping travelers create unforgettable memories while supporting local economies.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/aboutus.jpg"
            alt="Our team exploring the world"
            fill
            className="object-cover"
          />
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="bg-primary/5 rounded-xl p-10 text-center space-y-6">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-xl max-w-3xl mx-auto">
          To create a world where travelers can easily discover authentic experiences, and where local travel providers can thrive by sharing their expertise and passion.
        </p>
        <div className="grid md:grid-cols-3 gap-6 pt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="text-xl font-semibold">Authentic Experiences</h3>
              <p className="text-muted-foreground">
                We curate unique travel experiences that showcase the authentic culture and beauty of each destination.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-xl font-semibold">Local Empowerment</h3>
              <p className="text-muted-foreground">
                We empower local travel providers by giving them a platform to showcase their expertise and grow their business.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold">Trust & Safety</h3>
              <p className="text-muted-foreground">
                We prioritize the safety and satisfaction of both travelers and providers through our rigorous vetting process.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform makes it easy to discover, book, and enjoy authentic travel experiences.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center space-y-4">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold">Discover</h3>
            <p className="text-muted-foreground">
              Browse thousands of unique travel packages from local providers around the world.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold">Book</h3>
            <p className="text-muted-foreground">
              Securely book your chosen experience directly through our platform with just a few clicks.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold">Experience</h3>
            <p className="text-muted-foreground">
              Enjoy your authentic travel experience and create memories that will last a lifetime.
            </p>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            What sets TracoIt apart from other travel platforms.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Curated Experiences</h3>
              <p className="text-muted-foreground">
                Every package on our platform is carefully vetted to ensure quality and authenticity.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Direct Connection</h3>
              <p className="text-muted-foreground">
                Book directly with local providers, ensuring they receive fair compensation for their services.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">
                Our secure payment system protects both travelers and providers throughout the booking process.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our dedicated support team is available around the clock to assist with any questions or concerns.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-primary text-primary-foreground rounded-xl p-10 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
        <p className="text-xl max-w-3xl mx-auto">
          Join thousands of travelers who have discovered unique experiences through TracoIt.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/packages">Explore Packages</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
