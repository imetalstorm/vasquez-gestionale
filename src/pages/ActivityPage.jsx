import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import jsPDF from 'jspdf'

export default function ActivityPage() {

  const navigate = useNavigate()

  const { id } = useParams()

  const [activity, setActivity] = useState(null)

  const [employees, setEmployees] = useState([])

  const [editingEmployee, setEditingEmployee] = useState(null)

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [role, setRole] = useState('')
  const [salary, setSalary] = useState('')
  const [hireDate, setHireDate] = useState('')

  async function loadActivity() {

    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()

    setActivity(data)
  }

  async function loadEmployees() {

    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('activity_id', id)

    setEmployees(data || [])
  }

  async function generateContractPDF(employeeData) {

    const doc = new jsPDF()

    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, 210, 297, 'F')

    // FILIGRANA
    doc.setTextColor(235, 235, 235)

    doc.setFontSize(55)

    doc.text(
      employeeData.activityName,
      105,
      160,
      {
        angle: 45,
        align: 'center'
      }
    )

    // TESTO NERO
    doc.setTextColor(0, 0, 0)

    // HEADER
    doc.setFontSize(28)

    doc.text(
      employeeData.activityName,
      20,
      30
    )

    doc.setFontSize(12)

    doc.text(
      'Archivio Contratti Aziendali',
      20,
      40
    )

    doc.line(20, 48, 190, 48)

    // TITOLO
    doc.setFontSize(20)

    doc.text(
      'CONTRATTO DI ASSUNZIONE',
      20,
      65
    )

    // TESTO
    doc.setFontSize(12)

    const contractText =
      `Con il presente documento, l'azienda ${employeeData.activityName} conferma ufficialmente l'assunzione del dipendente ${employeeData.name} ${employeeData.surname} all'interno della propria struttura lavorativa.`

    doc.text(
      contractText,
      20,
      85,
      {
        maxWidth: 170,
        lineHeightFactor: 1.6
      }
    )

    // DATI
    doc.setFontSize(13)

    doc.text(
      `Nome Dipendente: ${employeeData.name} ${employeeData.surname}`,
      20,
      130
    )

    doc.text(
      `Data di nascita: ${employeeData.birthdate}`,
      20,
      145
    )

    doc.text(
      `Ruolo Aziendale: ${employeeData.role}`,
      20,
      160
    )

    doc.text(
      `Retribuzione: ${employeeData.salary}`,
      20,
      175
    )

    doc.text(
      `Data Assunzione: ${employeeData.hireDate}`,
      20,
      190
    )

    doc.text(
      `Data Contratto: ${new Date().toLocaleDateString()}`,
      20,
      205
    )

    doc.line(20, 220, 190, 220)

    // FIRME
    doc.setFontSize(12)

    doc.text(
      'Firma Proprietario',
      20,
      240
    )

    doc.text(
      employeeData.owner,
      20,
      252
    )

    doc.line(20, 257, 80, 257)

    doc.text(
      'Firma Dipendente',
      120,
      240
    )

    doc.text(
      `${employeeData.name} ${employeeData.surname}`,
      120,
      252
    )

    doc.line(120, 257, 180, 257)

    // FOOTER
    doc.setFontSize(9)

    doc.text(
      'Documento generato automaticamente dal Sistema Gestionale Aziendale.',
      20,
      285
    )

    // CREA PDF
    const pdfBlob = doc.output('blob')

    const fileName =
      `${Date.now()}_${employeeData.name}_${employeeData.surname}.pdf`

    // UPLOAD STORAGE
    await supabase
      .storage
      .from('Contracts')
      .upload(fileName, pdfBlob)

    // URL PUBBLICO
    const { data } = supabase
      .storage
      .from('Contracts')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  async function createEmployee() {

    const contractUrl =
      await generateContractPDF({
        activityName: activity?.name || 'Attività',
        owner: activity?.owner_name || 'Proprietario',
        name,
        surname,
        birthdate,
        role,
        salary,
        hireDate
      })

    if (editingEmployee) {

      await supabase
        .from('employees')
        .update({
          name,
          surname,
          birthdate,
          role,
          salary,
          hire_date: hireDate,
          contract_url: contractUrl
        })
        .eq('id', editingEmployee.id)

    } else {

      await supabase
        .from('employees')
        .insert({
          activity_id: id,
          name,
          surname,
          birthdate,
          role,
          salary,
          hire_date: hireDate,
          contract_url: contractUrl
        })
    }

    setEditingEmployee(null)

    setName('')
    setSurname('')
    setBirthdate('')
    setRole('')
    setSalary('')
    setHireDate('')

    loadEmployees()
  }

  function editEmployee(employee) {

    setEditingEmployee(employee)

    setName(employee.name)
    setSurname(employee.surname)
    setBirthdate(employee.birthdate)
    setRole(employee.role)
    setSalary(employee.salary)
    setHireDate(employee.hire_date)
  }

  async function deleteEmployee(employeeId) {

    await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId)

    loadEmployees()
  }

  useEffect(() => {

    loadActivity()
    loadEmployees()

  }, [])

  return (

    <div className="min-h-screen bg-black text-white p-8">

      {/* PULSANTE HOME FISSO */}

      <button
        onClick={() => navigate('/')}
        className="
          fixed
          top-6
          right-6
          z-50
          bg-yellow-500
          text-black
          px-6
          py-3
          rounded-2xl
          font-bold
          shadow-2xl
          hover:scale-105
          transition
        "
      >
        HOME
      </button>

      <h1 className="text-4xl text-yellow-500 font-bold mb-8">
        {activity?.name || 'Archivio Dipendenti'}
      </h1>

      <div className="bg-zinc-900 p-6 rounded-2xl mb-10">

        <h2 className="text-2xl mb-6">

          {editingEmployee
            ? 'Modifica Dipendente'
            : 'Aggiungi Dipendente'}

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

          {editingEmployee
            ? 'Salva Modifiche'
            : 'Aggiungi Dipendente'}

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

            <div className="flex gap-4 mt-6">

              <a
                href={employee.contract_url}
                target="_blank"
                className="
                  bg-blue-600
                  px-4
                  py-2
                  rounded-xl
                "
              >
                Contratto
              </a>

              <button
                onClick={() => editEmployee(employee)}
                className="
                  bg-yellow-500
                  text-black
                  px-4
                  py-2
                  rounded-xl
                "
              >
                Modifica
              </button>

              <button
                onClick={() => deleteEmployee(employee.id)}
                className="
                  bg-red-600
                  px-4
                  py-2
                  rounded-xl
                "
              >
                Elimina
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}