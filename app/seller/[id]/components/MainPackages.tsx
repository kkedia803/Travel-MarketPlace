import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import Image from "next/image"
import { Clock, IndianRupeeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/app/lib/supabase";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react"

interface Package {
    id: string;
    title: string;
    description: string;
    destination: string;
    price: number;
    duration: number;
    category: string;
    images: string[];
    seller_id: string;
    is_approved: boolean;
    discount?: number;
    itinerary?: Array<{ day: number; title: string, description: string; activity: string }>;
    inclusion?: string[];
    exclusion?: string[];
    final_price?: Number;
    cancellation_policy?: string[];
    start_dates?: string[];
    profiles?: {
        company_name: string;
        phone_number: string;
        avatar_url: string;
    }
}

interface Seller {
    id: String;
    name: String;
    role: String;
    avatar_url: String;
    user_name: String;
    bio: String;
    phone_number: String;
    company_name: String;
    created_At: Date;
}


export default function MainPackages() {
    const params = useParams();

    const [packages, setPackages] = useState<Package[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: pkgData, error: pkgError } = await supabase
                    .from("packages")
                    .select("*")
                    .eq("seller_id", params.id)
                    .eq("status", "active")
                    .order("created_at", { ascending: false });

                if (pkgError) throw pkgError;
                // console.log(pkgData);
                setPackages(pkgData)

            }
            catch (err) {
                console.log('Error fecthing data', err)
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    return (
        <div>
            {loading &&
                <div>
                    <h1>Loading...</h1>
                </div>
            }

            {!loading &&
                <div className="mt-10">
                    <h1 className="text-3xl font-semibold font-glitten tracking-wider mb-10">All Packages</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {packages?.map((packages) => (
                            <div key={packages.id} className="hover:scale-105 transition-transform duration-200 ease-in-out">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={`/packages/${packages.id}`}
                                                className="block relative rounded-md overflow-hidden shadow-md group"
                                            >
                                                <div className="relative aspect-[4/3] w-full">
                                                    <Image
                                                        src={packages.images[0] || "/placeholder.svg"}
                                                        fill
                                                        alt={packages.title}
                                                        className="object-cover transition-transform duration-500"
                                                    />
                                                    {(packages.discount || 0) > 0 && (
                                                        <div className="absolute top-2 right-2 z-10">
                                                            <Badge
                                                                className="bg-teal text-white font-onest font-medium px-3 py-1 text-xs shadow-md"
                                                            >
                                                                {packages.discount || 0}% OFF
                                                            </Badge>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0" />
                                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                                        <p className="overflow-y-hidden overflow-x-hidden text-4xl tracking-wider font-extrabold font-calsans text-white flex gap-1 items-center">
                                                            {packages.destination.split(",")[0]}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="bg-white dark:bg-card rounded-sm p-4 space-y-3 font-onest">
                                                        <h3 className="text-lg font-bold text-navy line-clamp-1">{packages.title}</h3>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <IndianRupeeIcon className="h-4 w-4 text-teal" />
                                                                <p className="text-sm font-medium">
                                                                    <span className="text-muted-foreground">Price:</span> ₹{packages.final_price?.toLocaleString()}<span>/person</span>
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-teal" />
                                                                <p className="text-sm font-medium">
                                                                    <span className="text-muted-foreground">Duration:</span> {packages.duration} days
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </TooltipTrigger>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ))}
                    </div>
                </div>}
        </div>
    )
}
