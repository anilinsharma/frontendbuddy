import './globals.css';

export const metadata = {
  title: 'FrontendBuddy AI Blog Admin',
  description: 'Manage futuristic AI stories, categories, and writers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-midnight text-slate-100 bg-grid [background-size:24px_24px]">
        {children}
      </body>
    </html>
  );
}
