import React from "react"

const AUTH_USER_KEY = "authUser"
const REGISTERED_USERS_KEY = "registeredUsers"

export const AuthContext = React.createContext({
	user: null,
	isAuthenticated: false,
	login: async () => {},
	logout: () => {},
	register: async () => {},
})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = React.useState(null)

	React.useEffect(() => {
		try {
			const storedUserRaw = localStorage.getItem(AUTH_USER_KEY)
			if (storedUserRaw) {
				const storedUser = JSON.parse(storedUserRaw)
				setUser(storedUser)
			}
		} catch {}
	}, [])

	const login = async ({ email, password }) => {
		const registryRaw = localStorage.getItem(REGISTERED_USERS_KEY)
		const registeredUsers = registryRaw ? JSON.parse(registryRaw) : []

		const matchedUser = registeredUsers.find((u) => u.email === email && u.password === password)
		if (!matchedUser) {
			throw new Error("Invalid email or password")
		}

		const authUser = { email: matchedUser.email, name: matchedUser.name || matchedUser.email }
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser))
		setUser(authUser)
	}

	const logout = () => {
		localStorage.removeItem(AUTH_USER_KEY)
		setUser(null)
	}

	const register = async ({ name, email, password }) => {
		const registryRaw = localStorage.getItem(REGISTERED_USERS_KEY)
		const registeredUsers = registryRaw ? JSON.parse(registryRaw) : []

		const emailExists = registeredUsers.some((u) => u.email === email)
		if (emailExists) {
			throw new Error("Email already registered")
		}

		registeredUsers.push({ name, email, password })
		localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers))

		const authUser = { email, name: name || email }
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser))
		setUser(authUser)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user),
				login,
				logout,
				register,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => React.useContext(AuthContext)


