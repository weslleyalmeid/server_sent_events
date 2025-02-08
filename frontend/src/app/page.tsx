import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-4xl font-bold">Home Page</h1>
      <Link href="/pages/simple_stream">
        <Button variant="outline">Go to Page Simple Stream</Button>
      </Link>
      <Link href="/pages/openai_stream">
        <Button variant="outline">Go to Page OpenAI Stream</Button>
      </Link>
      <Link href="/pages/openai_stream_sdk">
        <Button variant="outline">Go to Page OpenAI Stream SDK</Button>
      </Link>
    </div>
  )
}

