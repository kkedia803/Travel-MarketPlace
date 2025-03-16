import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Compass, Globe, Map, Shield, Star } from "lucide-react"

export default function Home() {
  // Featured destinations data
  const featuredDestinations = [
    {
      id: 1,
      title: "Bali Paradise",
      image: "/placeholder.svg?height=400&width=600",
      location: "Bali, Indonesia",
      price: 1299,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Swiss Alps Adventure",
      image: "/placeholder.svg?height=400&width=600",
      location: "Switzerland",
      price: 1899,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Santorini Getaway",
      image: "/placeholder.svg?height=400&width=600",
      location: "Greece",
      price: 1599,
      rating: 4.7,
    },
  ]

  // Categories data
  const categories = [
    { name: "Beach Getaways", icon: <Compass className="h-6 w-6" /> },
    { name: "Mountain Escapes", icon: <Map className="h-6 w-6" /> },
    { name: "Cultural Tours", icon: <Globe className="h-6 w-6" /> },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20" />
        <div className="container relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Discover Your Next <span className="text-primary">Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Explore curated travel packages from verified sellers around the world. Book with confidence and create
              memories that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/explore">
                <Button size="lg" className="gap-2">
                  Explore Packages <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register?role=seller">
                <Button size="lg" variant="outline">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/explore?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 bg-primary/10 rounded-full mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Destinations</h2>
            <Link href="/explore">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
              <Link
                key={destination.id}
                href={`/packages/${destination.id}`}
                className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xl">{destination.title}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{destination.location}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold">
                      ${destination.price}
                      <span className="text-sm font-normal text-muted-foreground"> /person</span>
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Wanderlust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Sellers</h3>
              <p className="text-muted-foreground">
                All our travel packages come from verified and trusted travel agencies.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Experiences</h3>
              <p className="text-muted-foreground">
                Curated travel experiences with high standards and excellent reviews.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
              <p className="text-muted-foreground">
                Discover amazing destinations across the globe with our diverse packages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of travelers who have found their perfect getaway through Wanderlust.
          </p>
          <Link href="/explore">
            <Button size="lg" variant="secondary" className="gap-2">
              Explore Packages <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

