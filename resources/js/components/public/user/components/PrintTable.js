// PrintTable.js

export const printTable = (data) => {
    console.log('Printing Data:', data); // Debugging line

    if (!data || !Array.isArray(data)) {
        console.error('Invalid data passed to printTable:', data);
        return;
    }

    // Open a new window for printing
    const printWindow = window.open('', '', 'height=800,width=1200');

    // Construct the HTML as a string using template literals
    const tableHtml = `
        <html>
            <head>
                <title>User Data</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    table, th, td {
                        border: 1px solid #000;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    h2 {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h2>User Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Created</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(user => `
                            <tr>
                                <td>${user.id || 'N/A'}</td>
                                <td>${user.status || 'N/A'}</td>
                                <td>${user.username || 'N/A'}</td>
                                <td>${user.role_name || 'No Role'}</td>
                                <td>${user.email || 'N/A'}</td>
                                <td>${user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</td>
                                <td>${user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;

    // Write the HTML to the new window
    printWindow.document.write(tableHtml);
    printWindow.document.close();

    // Wait for the content to load before printing
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };
};
