# Money Savior

![Image](https://github.com/user-attachments/assets/3b890323-480f-47ed-98d7-b9e52f008795)
## Simple and Effective Personal Expense Management Application

Money Savior is a modern web application that helps you track and manage your daily expenses with ease. With a user-friendly interface and comprehensive features, the app gives you clear insights into your personal finances without requiring a complex backend system.

### 🌍 Language Support
- English
- Vietnamese (Tiếng Việt)

### 🌟 Key Features

- **Visual Dashboard**: Overview of expenses with charts and statistics
- **Transaction Management**: Easily add, edit, and delete income and expenses
- **Category Classification**: Category system with intuitive icons and colors
- **Detailed Reports**: Analyze spending by time period and category
- **Excel Export**: Create professional Excel reports with beautiful formatting
- **Local Storage**: Data securely stored in your browser
- **Responsive Interface**: Works smoothly on both desktop and mobile devices

### 🚀 Technologies Used

- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Ensuring safe and maintainable code
- **Tailwind CSS**: Flexible and efficient styling
- **ShadcnUI**: Beautiful and customizable component system
- **Recharts**: Creating visual charts
- **ExcelJS**: Exporting data to Excel files
- **LocalStorage/IndexedDB**: Local data storage

### 📋 System Requirements

- Node.js 18.0.0 or higher
- npm or yarn

### 🔧 Installation Guide

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/money-savior.git
cd money-savior
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the application in development mode:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### 📱 Usage Guide

#### Dashboard

The dashboard displays an overview of your financial situation, including:
- Total expenses and income for the month
- Current balance
- Expense distribution chart by category
- Spending trends compared to the previous month
- Recent transactions list

#### Transaction Management

- **Add new transaction**: Click the "Add transaction" button and fill in the details
- **View transactions**: Access the "Transactions" tab to see all transactions
- **Filter transactions**: Use filters to search by date or transaction type
- **Edit/Delete**: Click the three-dot menu next to a transaction to edit or delete it

#### Category Management

- **View categories**: Access the "Categories" tab to see all categories
- **Add new category**: Click the "Add category" button and fill in the details
- **Edit/Delete**: Click the three-dot menu next to a category to edit or delete it

#### Reports and Excel Export

- **View reports**: Access the "Reports" tab to see detailed analysis
- **Select time range**: Use the date picker to view reports for specific time periods
- **Export to Excel**: Click the "Export to Excel" button to download an Excel report

### 📁 Project Structure

\`\`\`
/money-savior
  /app                  # Next.js App Router
    /page.tsx           # Dashboard
    /transactions       # Transaction management
    /categories         # Category management
    /reports            # Reports and Excel export
  /components           # React components
    /ui                 # UI components (shadcn/ui)
    /expense-chart.tsx  # Expense charts
    /...
  /hooks                # Custom React hooks
  /lib                  # Utility functions
    /expense-context.tsx # Context API for state management
    /excel-export.ts    # Excel export function
    /utils.ts           # Utility functions
  /public               # Static assets
\`\`\`

### 🖼️ Screenshots

![Dashboard](https://placeholder.com/dashboard.png)
![Transactions](https://placeholder.com/transactions.png)
![Reports](https://placeholder.com/reports.png)

### 🤝 Contributing

Contributions are welcome! If you'd like to contribute to the project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 Upcoming Features

- [ ] Cloud data synchronization
- [ ] Multi-user support
- [ ] Budget setting and alerts
- [ ] Recurring transactions
- [ ] Import data from CSV/Excel files
- [ ] Native mobile application

### 📄 License

This project is distributed under the MIT License. See the `LICENSE` file for more details.

### 👨‍💻 Author

Money Savior was developed by [Your Name](https://github.com/your-username)

---

<p align="center">Made with ❤️ for better financial management</p>
