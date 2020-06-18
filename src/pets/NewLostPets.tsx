import React, { useEffect, useState } from "react"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import "../styles.css"
import { deletePet, loadPet, newPet, savePet } from "./petsService"
import DangerLabel from "../common/components/DangerLabel"
import FormInput from "../common/components/FormInput"
import FormButtonBar from "../common/components/FormButtonBar"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormWarnButton from "../common/components/FormWarnButton"
import FormTitle from "../common/components/FormTitle"
import Form from "../common/components/Form"
import GlobalContent from "../common/components/GlobalContent"
import { RouteComponentProps } from "react-router-dom"
import { newLostPet } from "./lostPetsService"

export default function NewLostPet(props: RouteComponentProps<{ id: string }>) {
    const [missingDate, setMissingDate] = useState("")
    const [description, setDescription] = useState("")
    const [petId, setPetId] = useState("")
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [reward, setReward] = useState("")

    const errorHandler = useErrorHandler()


    const saveClick = async () => {
        errorHandler.cleanRestValidations()
        if (!name) {
            errorHandler.addError("name", "No puede estar vacío")
        }

        if (errorHandler.hasErrors()) {
            return
        }

        try {
            await newLostPet({ id: petId, name, missingDate, description,phoneContact: phoneNumber,reward })
            props.history.push("/lostpets")
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    useEffect(() => {
        const id  = props.match.params.id
    }, [])

    return (
        <GlobalContent>
            <FormTitle>Reportar Mascota Perdida</FormTitle>

            <Form>
                <FormInput
                    label="Nombre"
                    name="name"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Descripción"
                    name="description"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Ultimo día que la vieron"
                    name="missingDate"
                    value={missingDate}
                    onChange={event => setMissingDate(event.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Telefono de Contacto"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={event => setPhoneNumber(event.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Recompensa"
                    name="reward"
                    value={reward}
                    onChange={event => setReward(event.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Guardar" onClick={saveClick} />

                    <FormButton label="Cancelar" onClick={() => goHome(props)} />

                </FormButtonBar>
            </Form >
        </GlobalContent>
    )
}
