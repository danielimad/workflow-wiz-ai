import { Bot, Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "Integrations", href: "#integrations" },
      ]
    },
    {
      title: "Company", 
      links: [
        { label: "About Us", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Documentation", href: "#docs" },
        { label: "API Reference", href: "#api" },
        { label: "Contact Support", href: "#contact" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Security", href: "#security" },
        { label: "GDPR", href: "#gdpr" },
      ]
    }
  ];

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Company Info & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-xl">AI Manager</h3>
                <p className="text-sm text-muted-foreground">Business Automation Platform</p>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-md">
              Transform your business with intelligent AI agents that understand your workflows 
              and automate customer interactions across all channels.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Stay Updated</h4>
              <div className="flex gap-2 max-w-md">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button className="gradient-primary">Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get the latest updates on AI automation and new features.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="font-semibold">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors story-link"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-muted/30 rounded-lg mb-8">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">support@aimanager.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI Manager. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Made with ❤️ for business automation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}