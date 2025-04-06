import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Compass, Globe, Locate, LocateFixedIcon, LocateIcon, Map, Shield, Star } from "lucide-react"
import { MaskText } from "@/components/MaskText"
import { TextReveal } from "@/components/TextReveal"
import Image from "next/image"

export default function Home() {
  // Featured destinations data
  // #D6E6F2
  // #A6C6D8
  // #0F52BA
  // #000A26
  const featuredDestinations = [
    {
      id: 1,
      title: "Bali Paradise",
      image: "/balicover.webp",
      location: "Bali, Indonesia",
      price: 22999,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Manali Adventure",
      image: "https://kplexpeditions.com/wp-content/uploads/2023/09/Spiti-Winter-Trip-Himachal-Prade.jpg.webp",
      location: "Kullu Manali",
      price: 5899,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Royal Udaipur",
      image: "/udaipurcover.jpeg",
      location: "Udaipur",
      price: 9599,
      rating: 4.7,
    },
    {
      id: 4,
      title: "Royal Udaipur",
      image: "/udaipurcover.jpeg",
      location: "Udaipur",
      price: 9599,
      rating: 4.7,
    },
  ]

  // Categories data
  const categories = [
    { name: "Beach Getaways", src: "https://img.freepik.com/free-photo/beautiful-tropical-beach-sea_74190-6772.jpg?t=st=1743502150~exp=1743505750~hmac=254b72ee61c7a2793b77b7ea4aa418d21ba15acd979367fb166412f2010f2e4d&w=1380" },
    { name: "Mountain Escapes", src: "https://img.freepik.com/free-photo/traveling-with-off-road-car_23-2151473117.jpg?uid=R111481632&ga=GA1.1.648242056.1663832767&semt=ais_hybrid" },
    { name: "Cultural Tours", src: "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747354.jpg?t=st=1743502337~exp=1743505937~hmac=a30e95a0dc4ef06c7b5290b057e8adae7e0468497477cb3e25a5baf7a125bcb3&w=1380" },
    { name: "Adventure", src: "https://img.freepik.com/free-photo/horizontal-shot-group-people-hiking-mountains-covered-snow-cloudy-sky_181624-44954.jpg?t=st=1743503655~exp=1743507255~hmac=dcafc980cb35b8949f51aae739456e0a374dff14f4e8ab599d517c03591297b3&w=1380" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-28 md:py-32 px-4 md:h-screen">
        <div className="absolute inset-0 md:mx-10 mx-5 md:my-10 py-10 rounded-3xl bg-cover bg-center bgfixed bg-neutral-400 bg-blend-multiply bg-[url(https://img.freepik.com/free-photo/silhouette-person-standing-top-hill-beautiful-colorful-sky-morning_181624-24501.jpg)] z-1"
        // style={{
        //   backgroundImage: 'url(https://i.pinimg.com/736x/58/7b/51/587b516d81e0afa985142b5c2ad8824c.jpg)'
        // }}
        />
        <div className="container relative z-10 mx-auto max-w-8xl py-5">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-9xl font-semibold tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-stone-800 from-[20%] to-white/0 to-[80%] uppercase">
              {/* Adventure */}
              <MaskText />
              {/* <span className="text-white">Adventure</span> */}
            </h1>
            <p className="text-xs md:text-xl max-w-3xl text-balance text-[#D6E6F2]">
              {/* Explore curated travel packages from verified sellers around the world. Book with confidence and create
              memories that last a lifetime. */}
              <TextReveal />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/explore">
                <Button className="md:w-fit w-40 gap-2 backdrop-blur-sm bg-transparent border border-neutral-800 md:text-sm text-xs">
                  Explore Packages <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register?role=seller">
                <Button variant="outline" className="md:w-fit w-40 bg-white/90 md:text-sm text-xs">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-neutral-900 capitalize">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col itemscenter shadow-neutral-300 text-[#000A26] rounded-xl shadow-sm hover:shadow-md hover:shadow-[#0F52BA] transition-shadow bg-neutral-100 hover:scale-105 hover:transition-all hover:duration-300 hover:ease-in-out"
              >
                {/* <div className="p-4 rounded-full mb-4 bg-[#D6E6F2] text-[#000A26]">{category.icon}</div> */}
                <Image
                  className="rounded-xl mb-4 w-full h-full scale-105"
                  src={category.src}
                  width={100}
                  height={100}
                  alt='idnex'
                />
                <div className=" itemscenter p-4">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="hover:bg-[#000A26] bg-[#A6C6D8] text-[#000A26] hover:text-white transition-colors"
                  >
                    <Link
                      href={`/explore?category=${encodeURIComponent(category.name)}`}
                    >
                      Explore Now
                    </Link>
                  </Button>
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:max-w-6xl mx-auto">
            {featuredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="flex flex-col shadow-neutral-300 text-[#000A26] rounded-xl shadow-sm hover:shadow-md hover:shadow-[#0F52BA] transition-shadow bg-neutral-100 hover:scale-105 hover:transition-all hover:duration-300 hover:ease-in-out"
              >
                <Image
                  src={destination.image || "/placeholder.svg"}
                  width={100}
                  height={100}
                  alt={destination.title}
                  className="rounded-xl mb-4 w-full h-full scale-105"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{destination.title}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 bg-white mr-1" />
                      <span className="text-sm font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex gap-1 items-center"><LocateIcon />{destination.location}</p>
                  <div className="mt-4 items-center justify-between">
                    <p className="font-semibold">
                      ₹{destination.price}
                      <span className="text-sm font-normal text-muted-foreground"> /person</span>
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="hover:bg-[#000A26] bg-[#A6C6D8] text-[#000A26] hover:text-white transition-colors"
                    >
                      <Link
                        href={`/packages/${destination.id}`}
                      >
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TracoIt</h2>
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
            Join thousands of travelers who have found their perfect getaway through TracoIt.
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

