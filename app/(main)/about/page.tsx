import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Modern Blog",
  description: "Learn more about Modern Blog, our mission, and our team.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Modern Blog</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
            Modern Blog is a cutting-edge content platform designed to deliver high-quality, insightful articles on
            technology, design, business, and lifestyle topics.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to create a space where knowledge is accessible, engaging, and actionable. We believe in the
            power of well-crafted content to inspire, educate, and drive positive change.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p>
            Founded in 2023, Modern Blog began as a small project by a group of tech enthusiasts who wanted to share
            their knowledge and experiences with the world. What started as a passion project quickly grew into a
            comprehensive platform serving thousands of readers daily.
          </p>
          <p>
            As we've grown, we've remained committed to our core values: quality over quantity, reader-first approach,
            and continuous innovation. These principles guide everything we do, from the topics we cover to the features
            we develop.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
          <p>
            Behind Modern Blog is a diverse team of writers, editors, developers, and designers who are passionate about
            creating exceptional content and user experiences. Our team members bring expertise from various fields,
            ensuring that our content is both accurate and accessible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Joe Admin</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Founder & Editor-in-Chief</p>
              <p>
                With over 15 years of experience in technology and digital media, Joe leads our editorial direction and
                strategic initiatives.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Sarah Johnson</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Head of Content</p>
              <p>
                Sarah brings her expertise in content strategy and digital storytelling to ensure our articles are
                engaging, informative, and valuable to our readers.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Quality:</strong> We prioritize depth, accuracy, and thoughtfulness in everything we publish.
            </li>
            <li>
              <strong>Accessibility:</strong> We believe knowledge should be accessible to everyone, regardless of
              technical background.
            </li>
            <li>
              <strong>Innovation:</strong> We continuously explore new technologies and approaches to improve our
              platform.
            </li>
            <li>
              <strong>Community:</strong> We value the diverse perspectives and contributions of our readers and
              contributors.
            </li>
            <li>
              <strong>Integrity:</strong> We maintain editorial independence and transparency in all our content.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>
            We'd love to hear from you! Whether you have feedback, questions, or just want to say hello, feel free to
            reach out to us through our{" "}
            <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              contact page
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
