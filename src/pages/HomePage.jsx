import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function HomePage() {

  const [activities, setActivities] = useState([])
  const [search, setSearch] = useState('')

  const navigate = useNavigate()

  async function loadActivities() {

    const { data } = await supabase
      .from('activities')
      .select('*')

    if (data) {
      setActivities(data)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  return (

    <div
      className="
        min-h-screen
        bg-cover
        bg-center
        bg-no-repeat
      "
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.92)), url(\"/background.jpg\")'
      }}
    >

      <div className="p-10">

        <div className="flex flex-col items-center">

          <img
            src="/logo.png"
            alt="Vasquez"
            className="w-80 mb-8 drop-shadow-2xl"
          />

          <h1
            className="
              text-6xl
              font-bold
              text-yellow-500
              tracking-widest
              text-center
            "
          >
            STUDIO LEGALE VASQUEZ
          </h1>

          <p className="text-zinc-300 text-xl mt-4 text-center">
            Assistenza Legale • Formazione • Professionalità
          </p>

        </div>

        <div className="max-w-3xl mx-auto mt-14">

          <input
            type="text"
            placeholder="Ricerca dipendente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              p-5
              rounded-2xl
              bg-zinc-900/80
              border
              border-yellow-500
              text-white
              text-xl
              outline-none
              backdrop-blur-md
            "
          />

        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
            mt-16
          "
        >

          {activities.map((activity) => (

            <div
              key={activity.id}
              onClick={() => navigate(`/activity/${activity.id}`)}
              className="
                bg-zinc-900/70
                backdrop-blur-md
                border
                border-yellow-500
                rounded-3xl
                p-8
                cursor-pointer
                hover:scale-105
                hover:border-yellow-400
                transition
                shadow-2xl
              "
            >

              <h2
                className="
                  text-3xl
                  text-yellow-400
                  font-semibold
                "
              >
                {activity.name}
              </h2>

              <p className="text-zinc-300 mt-4">
                Accedi all'archivio dipendenti
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}