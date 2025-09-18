"use client"

import { useEffect, useState } from "react";
import { TopBanner } from "./components/TopBanner";
import { supabase } from "@/app/lib/supabase";
import { useParams } from "next/navigation";
import MainPackages from "./components/MainPackages";


export default function sellerPage() {

    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [seller, setSeller] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const { data: sellerData, error: sellerError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", params.id)

                if (sellerError) throw sellerError;
                // console.log(sellerData);

                const { data: pkgcount, error: pkgcountError } = await supabase
                    .from("packages")
                    .select('*', { count: 'exact' })
                    .eq("seller_id", params.id);

                if (pkgcountError) throw pkgcountError;
                console.log(pkgcount);

                const sellerWithCount = {
                    ...sellerData[0],
                    package_count: pkgcount.length ?? 0,
                }

                setSeller(sellerWithCount);
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
        <div className="container py-8">
            {!loading &&
                <>
                    <TopBanner seller={seller} />
                    <MainPackages />
                </>
            }

        </div>

    )
}