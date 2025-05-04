export default function InputError({ message }) {
    return message ? (
        <p className="text-sm text-destructive ">{message}</p>
    ) : null;
}
