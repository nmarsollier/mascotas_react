import React, { useEffect, useState } from "react"
import { RouteComponentProps } from "react-router-dom"
import DangerLabel from "../common/components/DangerLabel"
import ErrorLabel from "../common/components/ErrorLabel"
import Form from "../common/components/Form"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormButtonBar from "../common/components/FormButtonBar"
import FormInput from "../common/components/FormInput"
import FormTitle from "../common/components/FormTitle"
import GlobalContent from "../common/components/GlobalContent"
import ImageUpload from "../common/components/ImageUpload"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import { getProvinces, Province } from "../provinces/provincesService"
import "../styles.css"
import {
    getCurrentProfile,
    getPictureUrl,
    updateBasicInfo,
    updateProfilePicture
} from "./profileService"

export default function Profile(props: RouteComponentProps) {
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [picture, setPicture] = useState("")
    const [province, setProvince] = useState("")
    const [provinces, setProvinces] = useState<Province[]>([])

    const errorHandler = useErrorHandler()

    const loadProvinces = async () => {
        try {
            const result = await getProvinces()
            setProvinces(result)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const loadProfile = async () => {
        try {
            const result = await getCurrentProfile()

            setAddress(result.address)
            setEmail(result.email)
            setName(result.name)
            setPhone(result.phone)
            setPicture(result.picture)
            setProvince(result.province)

        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const uploadPicture = async (image: string) => {
        try {
            const result = await updateProfilePicture({
                image,
            })
            setPicture(result.id)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const updateClick = async () => {
        errorHandler.cleanRestValidations()
        if (!name) {
            errorHandler.addError("name", "No puede estar vacío")
        }
        if (!email) {
            errorHandler.addError("email", "No puede estar vacío")
        }
        if (errorHandler.hasErrors()) {
            return
        }

        try {
            await updateBasicInfo({
                address,
                email,
                name,
                phone,
                province,
            })
            goHome(props)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    useEffect(() => {
        void loadProvinces()
        void loadProfile()
    }, [])

    return (
        <GlobalContent>
            <FormTitle>Actualizar Perfil</FormTitle>

            <Form>
                <FormInput
                    label="Nombre"
                    name="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    errorHandler={errorHandler} />

                <div className="form-group">
                    <label>Profile Picture</label>
                    <ImageUpload src={getPictureUrl(picture)}
                        onChange={uploadPicture} />
                    <ErrorLabel message={errorHandler.getErrorText("name")} />
                </div>

                <FormInput
                    label="Email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    errorHandler={errorHandler} />

                <div className="form-group">
                    <label>Provincia</label>
                    <select
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                        className={errorHandler.getErrorClass("email", "form-control")}>
                        {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ErrorLabel message={errorHandler.getErrorText("province")} />
                </div>

                <FormInput
                    label="Dirección"
                    name="address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Teléfono"
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Actualizar" onClick={updateClick} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </Form >
        </GlobalContent>
    )
}
