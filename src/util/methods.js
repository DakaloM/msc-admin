export const formatDate = (x) => {
    const date = new Date(x)
    return date.getDate() + " " + date.toLocaleString('default', {month: 'long'}) + " " + date.getFullYear()
}