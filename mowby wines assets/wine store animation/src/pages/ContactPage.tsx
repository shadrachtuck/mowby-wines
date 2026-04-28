"use client";

import { motion } from "motion/react";
import { Mail, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { useState } from "react";
import { DecorativeFish } from "../components/DecorativeFish";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store contact form in localStorage
    const existingContacts = JSON.parse(
      localStorage.getItem("contactSubmissions") || "[]"
    );
    localStorage.setItem(
      "contactSubmissions",
      JSON.stringify([
        ...existingContacts,
        { ...formData, timestamp: Date.now() },
      ])
    );
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F2] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative"
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
          
          <div className="absolute -top-8 right-12">
            <DecorativeFish variant="blue" size="md" />
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <Card className="p-8 bg-white border-gray-200 shadow-lg">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="border-gray-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B9BF4] focus:border-transparent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#2B9BF4] hover:bg-[#2388D9] text-white px-8 py-6 text-lg rounded-full"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-serif mb-4 text-gray-900">
                  Message Sent!
                </h3>
                <p className="text-gray-700 mb-2">
                  Thank you for reaching out to us.
                </p>
                <p className="text-gray-600 mb-8">
                  We'll get back to you at{" "}
                  <span className="font-semibold">{formData.email}</span> as soon as
                  possible.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:bg-gray-50 rounded-full"
                >
                  Send Another Message
                </Button>
              </motion.div>
            )}
          </Card>
          
          <div className="absolute -bottom-12 -left-8">
            <DecorativeFish variant="pink" size="lg" />
          </div>
          <div className="absolute top-1/2 -right-12">
            <DecorativeFish variant="yellow" size="sm" />
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Mail className="w-5 h-5" />
            <a
              href="mailto:hello@mowbywines.com"
              className="hover:text-[#2B9BF4] transition-colors"
            >
              hello@mowbywines.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}