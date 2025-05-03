import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">About Money Savior</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
      <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              <div>
                <CardTitle>Developer</CardTitle>
                <CardDescription>About the creator</CardDescription>
              </div>
              <div className="flex items-center gap-3 justify-start md:justify-end">
                <img
                  src="/profile.jpg"
                  alt="AnDLP profile"
                  className="w-14 h-14 rounded-full border-2 border-primary object-cover"
                />
                <a
                  href="https://github.com/Andlpde150032"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1 break-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.479C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                  github.com/Andlpde150032
                </a>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Hi! I'm <span className="font-semibold">AnDLP</span> — the creator of Money Savior. I'm passionate about building useful, efficient, and delightful applications that help people manage their lives better. 
            </p>
            <p>
              I'm always working to improve Money Savior with new features and optimizations based on your feedback. If you have ideas, suggestions, or just want to say hello, feel free to reach out or connect with me on GitHub. Let's make Money Savior even better together!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>About the Project</CardTitle>
            <CardDescription>Learn more about Money Savior</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Money Savior is a modern, user-friendly expense tracking application designed to help you manage your finances effectively. 
              Built with Next.js and TypeScript, it offers a seamless experience for tracking your expenses, managing categories, and generating insightful reports.
            </p>
            <p>
              The project focuses on simplicity, security, and user experience, making personal finance management accessible to everyone.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>What makes Money Savior special</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Real-time expense tracking</li>
              <li>Customizable expense categories</li>
              <li>Detailed financial reports</li>
              <li>Multi-language support</li>
              <li>Dark/Light theme support</li>
              <li>Responsive design for all devices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
            <CardDescription>Built with modern technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Next.js 14 - React framework</li>
              <li>TypeScript - Type safety</li>
              <li>Tailwind CSS - Styling</li>
              <li>Shadcn UI - Component library</li>
              <li>NextAuth.js - Authentication</li>
              <li>Prisma - Database ORM</li>
            </ul>
          </CardContent>
        </Card>

     
      </div>
    </div>
  )
} 