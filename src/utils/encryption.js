import bcrypt from "bcrypt"
export const createHash = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 5)
    return hashedPassword
}
export const comparePassword = async (password, hashStored) => {
    const passwordCheck = await bcrypt.compare(password, hashStored)
    return passwordCheck
    }