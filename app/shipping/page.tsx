export default function Shipping() {
    return (
        <div className="container mx-auto py-10 space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">Shipping and Delivery Policy - TracoIt</h1>
            </section>

            {/* Our Story */}
            <section className="grid items-center">
                <div className="space-y-6">
                    <ul className='list-decimal list-outside space-y-4'>
                        <li className="text-lg">
                            <span className='text-xl underline'>Service Delivery</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                Once you complete a booking/payment on TracoIt, you will receive:
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        A booking confirmation email/SMS immediately.
                                    </li>
                                    <li>
                                        Digital travel documents (e.g., tickets, itineraries, vouchers) within 24-48 hours depending on the type of service.
                                    </li>
                                    <li>
                                        Travel agents or service providers on our platform may also contact you directly to share further details.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>No Physical Delivery</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        TracoIt does not ship or deliver any physical items.
                                    </li>
                                    <li>
                                        All services are fulfilled digitally or in-person at the travel/event location.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Timelines</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        Instant confirmation for most services.                                    </li>
                                    <li>
                                        For customized trips/events, confirmation may take up to 48 hours.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Customer Support    </span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        If you do not receive your booking confirmation or documents within the expected timeframe, please contact us at:
                                        📧 <span className='font-bold'>deepaktracoit@gmail.com</span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
