export default function formatMoney(value) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Use 'decimal' to avoid the currency symbol
        minimumFractionDigits: 2, // Ensure 2 decimal places
        maximumFractionDigits: 2
    });

    return formatter.format(value);
}