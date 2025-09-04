export default function Cancellation() {
    return (
        <div className="container mx-auto py-10 space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">Cancellation and Refund Policy - TracoIt</h1>
            </section>

            {/* Our Story */}
            <section className="grid items-center">
                <div className="space-y-6">
                    <div className="text-xl">
                        At TracoIt, we aim to provide flexibility and transparency for all our users. Since our services involve multiple travel agents, operators, and partners, cancellation and refund terms may vary depending on the specific package or provider.
                    </div>
                    <ul className='list-decimal list-outside space-y-4'>
                        <li className="text-lg">
                            <span className='text-xl underline'>General Cancellation Rules</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        30 days or more before trip start date: Eligible for 100% refund (after deducting any applicable transaction fees).
                                    </li>
                                    <li>
                                        15-29 days before trip start date: Eligible for a 50% partial refund.
                                    </li>
                                    <li>
                                        14 days or less before trip start date: No refund is applicable, as service providers will have already reserved resources.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Provider-Specific Policies</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        Each package may include its own cancellation terms based on the travel agent or operator.
                                    </li>
                                    <li>
                                        Users are advised to review package-specific policies before confirming a booking.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Refund Timelines</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        Approved refunds will be processed within 7-10 business days via the original payment method.
                                    </li>
                                    <li>
                                        Bank/payment gateway delays are outside Tracoit's control, but we will support you in case of issues.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Non-Refundable Services</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        Certain bookings such as last-minute deals, promotional offers, and non-cancellable packages may be non-refundable.
                                    </li>
                                    <li>
                                        Such conditions will be clearly displayed at the time of booking.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Force Majeure / Unforeseen Events</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        In cases such as natural disasters, pandemics, government restrictions, or other unforeseen events, refunds may vary based on provider policies.
                                    </li>
                                    <li>
                                        TracoIt will make every effort to negotiate fair terms for affected customers.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Contact for Cancellation</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        To request a cancellation or refund, please contact our support team 
                                        at:📧 <span className="font-bold">deepaktracoit@gmail.com</span>
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
