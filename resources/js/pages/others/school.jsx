import AppLayout from "@/layouts/app-layout"

export default function School() {
  return (
    <div>school</div>
  )
}

School.layout = page => <AppLayout children={page} title="List of Schools" />
