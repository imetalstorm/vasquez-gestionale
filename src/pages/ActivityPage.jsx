import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'

import jsPDF from 'jspdf'

export default function ActivityPage() {

  const { id } = useParams()

  const [employees, setEmployees] = useState([])

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [role, setRole] = useState('')
  const [salary, setSalary] = useState('')
  const [hireDate, setHireDate] = useState('')

  async function loadEmployees() {

    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('activity_id', id)

    setEmployees(data || [])
  }

  async function generateContractPDF(employeeData) {

    const doc = new jsPDF()

    doc.setFillColor(10, 10, 10)
    doc.rect(0, 0, 210, 297, 'F')

    doc.setTextColor(212, 175, 55)

    doc.setFontSize(24)

    doc.text(
      'STUDIO LEGALE VASQUEZ',
      20,
      25
    )

    doc.setFontSize(18)

    doc.text(
      'CONTRATTO DI LAVORO',
      20,
      45
    )

    doc.setTextColor(255, 255, 255)

    doc.setFontSize(13)

    doc.text(
      `Dipendente: ${employeeData.name} ${employeeData.surname}`,
      20,
      80
    )

    doc.text(
      `Data di nascita: ${employeeData.birthdate}`,
      20,
      95
    )

    doc.text(
      `Ruolo: ${employeeData.role}`,
      20,
      110
    )

    doc.text(
      `Stipendio: ${employeeData.salary}`,
      20,
      125
    )

    doc.text(
      `Data Assunzione: ${employeeData.hireDate}`,
      20,
      140
    )

    doc.text(
      `Data Contratto: ${new Date().toLocaleDateString()}`,
      20,
      155
    )

    doc.setFontSize(11)

    doc.text(
      'Il dipendente accetta i termini lavorativi stabiliti dall’azienda.',
      20,
      185
    )

    doc.text(
      'Firma Datore di Lavoro:',
      20,
      225
    )

    doc.text(
      'Firma Dipendente:',
      120,
      225
    )

    doc.line(20, 235, 80, 235)

    doc.line(120, 235, 180, 235)

    const fileName =
      `${employeeData.name}_${employeeData.surname}.pdf`

    doc.save(fileName)
  }

  async function createEmployee() {

    await generateContractPDF({
      name,
      surname,
      birthdate,
      role,
      salary,
      hireDate
    })

    await supabase
      .from('employees')
      .insert({
        activity_id: id,
        name,
        surname,
        birthdate,
        role,
        salary,
        hire_date: hireDate
      })

    setName('')
    setSurname('')
    setBirthdate('')
    setRole('')
    setSalary('')
    setHireDate('')

    loadEmployees()
  }

  async function deleteEmployee(employeeId) {

    await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId)

    loadEmployees()
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl text-yellow-500 font-bold mb-8">
        Archivio Dipendenti
      </h1>

      <div className="bg-zinc-900 p-6 rounded-2xl mb-10">

        <h2 className="text-2xl mb-6">
          Aggiungi Dipendente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            placeholder="Cognome"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            placeholder="Data di nascita"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            placeholder="Ruolo"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            placeholder="Stipendio"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="date"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800"
          />

        </div>

        <button
          onClick={createEmployee}
          className="
            mt-6
            bg-yellow-500
            text-black
            px-6
            py-3
            rounded-xl
            font-bold
          "
        >
          Aggiungi Dipendente
        </button>

      </div>

      <div className="grid grid-cols-1 gap-6">

        {employees.map((employee) => (

          <div
            key={employee.id}
            className="
              bg-zinc-900
              border
              border-yellow-500
              rounded-2xl
              p-6
            "
          >

            <h2 className="text-2xl text-yellow-400">
              {employee.name} {employee.surname}
            </h2>

            <div className="mt-4 space-y-2 text-zinc-300">

              <p>
                Data di nascita: {employee.birthdate}
              </p>

              <p>
                Ruolo: {employee.role}
              </p>

              <p>
                Stipendio: {employee.salary}
              </p>

              <p>
                Data Assunzione: {employee.hire_date}
              </p>

            </div>

            <button
              onClick={() => deleteEmployee(employee.id)}
              className="
                mt-6
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