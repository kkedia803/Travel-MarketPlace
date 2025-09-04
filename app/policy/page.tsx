export default function Policy() {
    return (
        <div className="container mx-auto py-10 space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">Terms and Conditions - TracoIt</h1>
            </section>

            {/* Our Story */}
            <section className="grid items-center">
                <div className="text-right mb-4">
                    <h1 className="text-base text-muted-foreground">Last Updated - 04/09/2025</h1>
                </div>
                <div className="space-y-6">
                    <div className="text-xl">
                        At TracoIt, we value your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website, mobile application, or services. By using TracoIt, you agree to the terms of this Privacy Policy.
                    </div>
                    <ul className='list-decimal list-outside space-y-4'>
                        <li className="text-lg">
                            <span className='text-xl underline'>Information We Collect</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                We may collect the following types of information when you use TracoIt:
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        Personal Information: Name, email address, phone number, date of birth, gender, and payment details.
                                    </li>
                                    <li>
                                        Account Information: Login credentials, preferences, and settings.
                                    </li>
                                    <li>
                                        Booking Information: Travel dates, destinations, and booking details.
                                    </li>
                                    <li>
                                        Device & Usage Information: IP address, browser type, device information, and app usage data.
                                    </li>
                                    <li>
                                        Social Media Data: If you sign up via social platforms (Instagram, Google, etc.), we may access basic profile information with your consent.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>How We Use Your Information</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                We use the collected information for:
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>Processing and confirming travel bookings.</li>
                                    <li>Connecting users with travel agents and service providers.</li>
                                    <li>Sending confirmations, updates, and trip-related communications.</li>
                                    <li>Improving our services, features, and user experience.</li>
                                    <li>Marketing and promotional purposes (with your consent).</li>
                                    <li>Complying with legal and regulatory requirements.</li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Sharing of Information</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                We do not sell or rent your personal data to third parties. However, we may share information with:
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>Travel Agents &amp; Service Providers: To complete your bookings.</li>
                                    <li>Payment Gateways (e.g., Razorpay, Stripe): For processing payments securely.</li>
                                    <li>Legal Authorities: If required by law or to prevent fraud/misuse.</li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Cookies & Tracking Technologies</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                TracoIt uses cookies and similar technologies to:
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>Improve website functionality.</li>
                                    <li>Remember your preferences.</li>
                                    <li>Analyze user behavior for better services.</li>
                                    <li>You can manage or disable cookies in your browser settings.</li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Data Security</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>We use encryption, firewalls, and secure servers to protect your data.</li>
                                    <li>Payment details are processed via trusted third-party gateways; we do not store your card/bank details.</li>
                                    <li>Despite our best efforts, no system is 100% secure. Users are advised to use strong passwords and keep login credentials private.</li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Your Rights</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                You have the right to:
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>Access, update, or delete your personal data.</li>
                                    <li>Opt-out of marketing communications.</li>
                                    <li>Withdraw consent where applicable.</li>
                                    <li>Request a copy of the data we hold about you.</li>
                                    <li>To exercise these rights, email us at : 📧<a className="font-bold" href="mailto:deepaktracoit@gmail.com">deepaktracoit@gmail.com</a></li>
                                </ul>
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Third-Party Links</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                TracoIt may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Changes to this Privacy Policy</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                We may update this Privacy Policy from time to time. Any changes will be posted with a revised “Last Updated” date.
                            </div>
                        </li>
                        <li className="text-lg">
                            <span className='text-xl underline'>Contact Us</span>
                            <div className='text-base mt-3 text-muted-foreground'>
                                <ul className='list-disc list-inside space-y-2 mt-1'>
                                    <li>
                                        If you have any questions or concerns about this Privacy Policy, reach us
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
