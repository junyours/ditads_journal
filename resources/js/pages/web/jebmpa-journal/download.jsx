export default function Download() {
    return (
        <ul>
            <li className="flex flex-col gap-2">
                <a
                    href="/files/DIT.ADS_JEBMPA-Template.docx"
                    download="DIT.ADS_JEBMPA-Template.docx"
                    className="hover:underline hover:text-blue-600"
                >
                    • DIT.ADS_JEBMPA-Template
                </a>
            </li>
        </ul>
    );
}
