import TaskBoard from '@/components/TaskBoard'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Task Manager</h1>
        <TaskBoard />
      </div>
    </main>
  )
}
