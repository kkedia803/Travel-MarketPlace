import { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Contact Us | TravelMarketplace',
  description: 'Get in touch with our team for any questions or support',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-10 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions or need assistance? We're here to help you with anything you need.
        </p>
      </section>
      
      {/* Contact Information and Form */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground mb-6">
              Our team is available to answer your questions and provide support. Feel free to reach out to us through any of the following channels.
            </p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-primary/10 rounded-full p-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Available Monday-Friday, 9am-5pm EST</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-primary/10 rounded-full p-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">support@travelmarketplace.com</p>
                  <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-primary/10 rounded-full p-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h3 className="font-semibold">Office</h3>
                  <p className="text-muted-foreground">123 Travel Street, Suite 100</p>
                  <p className="text-muted-foreground">San Francisco, CA 94103</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
          <ContactForm />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I book a travel package?</AccordionTrigger>
            <AccordionContent>
              Booking a travel package is easy! Simply browse our available packages, select the one you're interested in, choose your dates, and complete the booking process. You'll receive a confirmation email with all the details of your booking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is your cancellation policy?</AccordionTrigger>
            <AccordionContent>
              Our cancellation policy varies depending on the package and provider. Generally, cancellations made 30 days or more before the start date are eligible for a full refund. Cancellations made 15-29 days before may receive a partial refund. Please check the specific terms for each package before booking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I become a seller on TravelMarketplace?</AccordionTrigger>
            <AccordionContent>
              To become a seller, you need to create an account and apply for seller status. We'll review your application and, if approved, you'll be able to list your travel packages on our platform. We look for providers who offer unique, authentic experiences and have the necessary qualifications and insurance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Is my payment secure?</AccordionTrigger>
            <AccordionContent>
              Yes, all payments on TravelMarketplace are processed securely. We use industry-standard encryption and secure payment processors to ensure your financial information is protected at all times.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>What if I have an issue during my trip?</AccordionTrigger>
            <AccordionContent>
              If you encounter any issues during your trip, you can contact your travel provider directly using the contact information provided in your booking confirmation. If you need additional assistance, our support team is available 24/7 to help resolve any problems.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
