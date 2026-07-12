"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Search, Plus, Trash2, X } from "lucide-react"

type Driver = {
  id: number
  name: string
  username: string
  age: number
  gender: string
  email: string
  phoneNo: string
  address: string
  drivingLicense: string
}

type DriverFormData = {
  name: string
  username: string
  age: string
  gender: string
  email: string
  phoneNo: string
  address: string
  drivingLicense: string
}

const initialFormData: DriverFormData = {
  name: "",
  username: "",
  age: "",
  gender: "Male",
  email: "",
  phoneNo: "",
  address: "",
  drivingLicense: "",
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [formData, setFormData] = useState<DriverFormData>(initialFormData)

  const fetchDrivers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/driver")
      if (!response.ok) {
        throw new Error("Failed to load drivers")
      }
      const data = (await response.json()) as Driver[]
      setDrivers(data)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load drivers",
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchDrivers()
  }, [])

  const openAddModal = () => {
    setFormData(initialFormData)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData(initialFormData)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      setError(null)
      const response = await fetch("/api/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to add driver")
      }

      await fetchDrivers()
      closeModal()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to add driver",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this driver?")
    if (!confirmed) {
      return
    }

    try {
      setError(null)
      const response = await fetch(`/api/driver/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to delete driver")
      }

      await fetchDrivers()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete driver",
      )
    }
  }

  const filteredDrivers = drivers.filter((driver) => {
    const query = searchText.toLowerCase()
    return (
      driver.name.toLowerCase().includes(query) ||
      driver.username.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.drivingLicense.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Drivers</h2>
          <p className="text-slate-400">Manage your driver database</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <Button
            variant="ghost"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <Bell size={20} />
          </Button>
          <Button
            className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Driver
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <Card className="w-full max-w-3xl border-purple-500/20 bg-slate-900 text-slate-200 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <CardTitle className="text-white">Add Driver</CardTitle>
                <p className="text-sm text-slate-400">
                  Create a new driver record
                </p>
              </div>
              <Button
                variant="ghost"
                className="p-2 text-slate-400 hover:text-white"
                onClick={closeModal}
              >
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="Rajesh Kumar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Username</label>
                  <input
                    required
                    value={formData.username}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        username: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="rajesh.kumar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Age</label>
                  <input
                    required
                    type="number"
                    min="18"
                    value={formData.age}
                    onChange={(event) =>
                      setFormData({ ...formData, age: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="32"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Gender</label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(event) =>
                      setFormData({ ...formData, gender: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="driver@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Phone No.</label>
                  <input
                    required
                    value={formData.phoneNo}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        phoneNo: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="9876543210"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-slate-300">Address</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        address: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-slate-300">
                    Driving License
                  </label>
                  <input
                    required
                    value={formData.drivingLicense}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        drivingLicense: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="DL-12-CD-2024"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="border border-slate-700 text-slate-200 hover:bg-slate-700/50"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {isSubmitting ? "Saving..." : "Save Driver"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-slate-400">
              Loading drivers...
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              No drivers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="px-4 py-3 text-left">NAME</th>
                    <th className="px-4 py-3 text-left">USERNAME</th>
                    <th className="px-4 py-3 text-left">AGE</th>
                    <th className="px-4 py-3 text-left">GENDER</th>
                    <th className="px-4 py-3 text-left">EMAIL</th>
                    <th className="px-4 py-3 text-left">PHONE</th>
                    <th className="px-4 py-3 text-left">ADDRESS</th>
                    <th className="px-4 py-3 text-left">LICENSE</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30"
                    >
                      <td className="py-3 px-4 text-slate-200">
                        {driver.name}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {driver.username}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {driver.age}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {driver.gender}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {driver.email}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {driver.phoneNo}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {driver.address}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {driver.drivingLicense}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => void handleDelete(driver.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
