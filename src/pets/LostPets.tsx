import React, { useState, useEffect } from "react"
import "../styles.css"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import FormButtonBar from "../common/components/FormButtonBar"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormTitle from "../common/components/FormTitle"
import GlobalContent from "../common/components/GlobalContent"
import { RouteComponentProps } from "react-router-dom"
import { LostPet, loadLostPets, findPet } from "./lostPetsService"
import { deletePet } from "./petsService"


export default function LostPets(props: RouteComponentProps) {
    const [pets, setPets] = useState<LostPet[]>([])

    const errorHandler = useErrorHandler()

    const loadCurrentLostPets = async () => {
        try {
            const result = await loadLostPets()
            setPets(result)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const newLostPetClick = () => {
        props.history.push("/registerLostPet")
    }

    useEffect(() => {
        void loadCurrentLostPets()
    }, [])

    return (
        <GlobalContent>
            <FormTitle>Mascotas Perdidas</FormTitle>
            <table id="mascotas-perdidas" className="table">
                <thead>
                    <tr>
                        <th> Nombre </th>
                        <th> Descripción </th>
                        <th> Fecha de desaparición </th>
                        <th> Contacto dueño </th>
                        <th> Recompensa </th>
                        <th> !Yo lo encontre! </th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map((pet, i) => {
                        return (
                            <tr key={i}>
                                <td>{pet.name}</td>
                                <td>{pet.description}</td>
                                <td>{pet.missingDate}</td>
                                <td>{pet.phoneContact}</td>
                                <td>{pet.reward}</td>
                                <td className="text">
                                    <img
                                        src="/assets/favicon.png"
                                        alt=""
                                        onClick={() => findPet(pet.id)} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <FormButtonBar>
                <FormAcceptButton label="Reportar Perdida" onClick={newLostPetClick} />
                <FormButton label="Cancelar" onClick={() => goHome(props)} />
            </FormButtonBar>
        </GlobalContent>
    )
}
