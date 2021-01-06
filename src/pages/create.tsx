import { Field, Form, Formik, useFormik } from "formik"
import React, { useEffect, useRef, useState } from "react"
import Header from "../components/Header"
import { Lolly } from "../components/Lolly"
import "../styles/Create.css"
import * as Yup from "yup"
import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import Result from "../components/Result"
import axios from "axios";
import Footer from "../components/Footer"

const ADD_LOLLY = gql`
    mutation addLolly($color1: String!, 
        $color2: String!,
        $color3: String!,
        $reciever: String!,
        $sender: String!,
        $message: String!){
            addLolly(color1: $color1,color2: $color2,color3: $color3,reciever: $reciever,sender: $sender,message: $message){
                sender
                reciever
                message
                link
            }
    }
`
const DisplayingErrorMessagesSchema = Yup.object().shape({
    reciever: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    sender: Yup.string().required("Required").min(2, 'Too Short!')
        .max(50, 'Too Long!'),
    message: Yup.string().required('Required').min(2, 'Too Short')
});


const Create = () => {

    const [color1, setColor1] = useState("#d52358")
    const [color2, setColor2] = useState("#e95946")
    const [color3, setColor3] = useState("#deaa43")
    const [addLolly, { data }] = useMutation(ADD_LOLLY);

    const formik = useFormik({
        initialValues: {
            reciever: '',
            sender: '',
            message: '',
        },
        validationSchema: DisplayingErrorMessagesSchema,
        onSubmit: (values, { resetForm }) => {
            addLolly({
                variables: {
                    color1, color2, color3,
                    reciever: values.reciever,
                    sender: values.sender,
                    message: values.message
                }
            })

            resetForm({
                values: {
                    reciever: ""
                    , sender: "", message: ""
                }
            })


        },
    });
    useEffect(() => {
        async function runHook() {
            const response = await axios("https://api.netlify.com/build_hooks/5ff5b423b70adff929d0003c", {
                method: "POST",
            });

        }
        runHook();

    }, [data])



    return (
        <div className="create">
            <Header />

            <div className="lollyFormDiv">
                <div>
                    <Lolly top={color1} middle={color2} bottom={color3} />
                </div>
                {!data ? <> <div className="lollyFlavourDiv">
                    <label htmlFor="flavourTop" className="colorPickerLabel">
                        <input
                            type="color"
                            value={color1}
                            className="colorPicker"
                            name="flavourTop"
                            id="flavourTop"
                            onChange={e => {
                                setColor1(e.target.value)
                            }}
                        />
                    </label>

                    <label htmlFor="flavourTop" className="colorPickerLabel">
                        <input
                            type="color"
                            value={color2}
                            className="colorPicker"
                            name="flavourTop"
                            id="flavourTop"
                            onChange={e => {
                                setColor2(e.target.value)
                            }}
                        />
                    </label>
                    <label htmlFor="flavourTop" className="colorPickerLabel">
                        <input
                            type="color"
                            value={color3}
                            className="colorPicker"
                            name="flavourTop"
                            id="flavourTop"
                            onChange={e => {
                                setColor3(e.target.value)
                            }}
                        />
                    </label>
                </div>

                    <form className="form-container" onSubmit={formik.handleSubmit}>
                        <label htmlFor="firstName">To</label>
                        <br /> <input
                            id="reciever"
                            name="reciever"
                            type="text"
                            placeholder="A lolly for..."
                            onChange={formik.handleChange}
                            value={formik.values.reciever}
                        />

                        {formik.errors.reciever ? <div className="error">{formik.errors.reciever}</div> : null}
                        <br /> <label htmlFor="message">Say something nice</label>
                        <br /> <textarea
                            id="message"
                            name="message"
                            

                            onChange={formik.handleChange}
                            value={formik.values.message}
                        />
                        <br />
                        {formik.errors.message ? <div className="error">{formik.errors.message}</div> : null}
                        <label htmlFor="sender">From</label>
                        <br />
                        <input
                            id="sender"
                            name="sender"
                            type="sender"
                            onChange={formik.handleChange}
                            value={formik.values.sender}
                            placeholder="From your friend.."
                        />
                        {formik.errors.sender ? <div className="error">{formik.errors.sender}</div> : null}
                        <div className="space-mob">

                        </div>
                        <button type="submit">Freeze this lolly and get a link</button>
                    </form></> : <Result link={data?.addLolly?.link} reciever={data?.addLolly?.reciever} sender={data?.addLolly?.sender} message={data?.addLolly?.message} />}
            </div>
            <Footer></Footer>
        </div >
    )
}
export default Create
