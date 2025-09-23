<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="google-site-verification" content="R_0o7TCe9W3RXtB8e3fkpcH7GebAtjpzwDacgcG0tpU" />
    <link rel="shortcut icon" href="/images/ditads-logo.png" type="image/x-icon" />

    <title inertia>{{ config('app.name') }}</title>

    @if(isset($journal))
        <meta name="citation_title" content="{{ $journal->title }}">
        @foreach(explode(',', $journal->author) as $author)
            <meta name="citation_author" content="{{ trim($author) }}">
        @endforeach
        <meta name="citation_publication_date"
            content="{{ \Carbon\Carbon::parse($journal->published_at)->format('Y/m/d') }}">
        <meta name="citation_volume" content="{{ $journal->volume }}">
        <meta name="citation_issue" content="{{ $journal->issue }}">
        <meta name="citation_pages" content="{{ $journal->page_number }}">
        <meta name="citation_doi" content="{{ $journal->doi }}">
        <meta name="citation_publisher" content="ZAS Digital Institute Training and Development Services">
        <meta name="citation_journal_title" content="{{ $journal->type === 'imrj'
            ? 'DIT.ADS International Multidisciplinary Research Journal'
            : 'DIT.ADS Journal of Economics, Business Management, and Public Administration' 
                    }}">
        <meta name="citation_pdf_url"
            content="{{ url(($journal->type === 'imrj' ? 'IMRJ/' : 'JEBMPA/') . $journal->pdf_file) }}">
    @endif

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700,800,900&display=swap" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>