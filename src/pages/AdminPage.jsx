import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export default function AdminPage() {

  const [activities, setActivities] = useState([])
  const [name, setName] = useState('')
  const [banner, setBanner] = useState('')

  async function loadActivities() {

    const { data } = await supabase
      .from('activities')
      .select('*')

    setActivities(data || [])
  }

  async function createActivity() {

    if (!name) return

    await supabase
      .from('activities')
      .insert({
        name: name,
        banner_url: banner
      })

    setName('')
    setBanner('')

    loadActivities()
  }

  async function deleteActivity(id) {

    await supabase
      .from('activities')
      .delete()
      .eq('id', id)

    loadActivities()
  }

  useEffect(() => {
    loadActivities()
  }, [])

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl text-yellow-500 font-bold mb-8">
        Pannello Admin
      </h1>

      <div className="bg-zinc-900 p-6 rounded-2xl mb-8">

        <h2 className="text-2xl mb-4">
          Crea Attività
        </h2>

        <input
          type="text"
          placeholder="Nome attività"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full
            p-4
            rounded-xl
            bg-zinc-800
            mb-4
          "
        />

        <input
          type="text"
          placeholder="Banner URL"
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          className="
            w-full
            p-4
            rounded-xl
            bg-zinc-800
            mb-4
          "
        />

        <button
          onClick={createActivity}
          className="
            bg-yellow-500
            text-black
            px-6
            py-3
            rounded-xl
            font-bold
          "
        >
          Crea
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {activities.map((activity) => (

          <div
            key={activity.id}
            className="
              bg-zinc-900
              p-6
              rounded-2xl
              border
              border-yellow-500
            "
          >

            <h2 className="text-2xl text-yellow-400">
              {activity.name}
            </h2>

            <button
              onClick={() => deleteActivity(activity.id)}
              className="
                mt-4
                bg-red-600
                px-4
                py-2
                rounded-xl
              "
            >
              Elimina
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}