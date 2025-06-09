export default function Download() {
    return (
        <ul>
            <li className="flex flex-col gap-2">
                <a
                    href="/files/DIT.ADS_IMRJ-Template.docx"
                    download="DIT.ADS_IMRJ-Template.docx"
                    className="hover:underline hover:text-blue-600"
                >
                    • DIT.ADS_IMRJ-Template
                </a>
                <a
                    href="/files/DIT.ADS_IMRJ-Copyright.pdf"
                    download="DIT.ADS_IMRJ-Copyright.pdf"
                    className="hover:underline hover:text-blue-600"
                >
                    • DIT.ADS_IMRJ-Copyright
                </a>
            </li>
        </ul>
    );
}
