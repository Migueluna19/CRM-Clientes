import { obtenerCliente,ActualizarCliente } from "../data/Clientes"
import Formulario from "../components/Formulario"
import { Form,Navigate, useNavigate,useLoaderData, useActionData,redirect } from "react-router-dom"
import Error from "../components/Error"

export async function loader({params}){
    const cliente= await obtenerCliente(params.clienteID)
    if(Object.values(cliente).length===0){
        throw new Response('',{
            status:404,
            statusText:'No Hay resultados'
        })
    }
    return cliente
}

export async function action({request,params}){
    const formData =await request.formData()
    const datos=Object.fromEntries(formData)
    const email=formData.get('email')
    //Validacion
    const errores=[]
    if(Object.values(datos).includes('')){
        errores.push('Todos los Campos son Obligatorios');
    }
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    if(!regex.test(email)){
        errores.push('El Email no es válido');
    }
    //Retornando datos
    if(Object.keys(errores).length){
        return errores
    }
    //Actualizar Cliente

   await ActualizarCliente(params.clienteID,datos)
   return redirect('/')
}

function EditarCliente() {
const navigate=useNavigate()
const cliente=useLoaderData()
const errores=useActionData()
  return (
    <>
    <h1 className="font-black text-4xl text-blue-900">Editar Cliente</h1>
    <p className="mt-3">Puedes Modificar los Campos de un Cliente</p>
     <div className="flex justify-end">
     <button
     className="bg-blue-800 text-white px-3 py-1 font-bold uppercase"
     onClick={()=>navigate('/')}>
         Volver</button>
     </div>
     <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20">
          {errores?.length && errores.map((error,i)=><Error key={i}>{error}</Error>)} 
         <Form
         method='POST'
         >
     <Formulario
     cliente={cliente}
     />
     <input
     type="submit"
     className="mt-5 w-full bg-blue-800 p-3 uppercase text-white text-lg"
     value="Guardar Cambios"
     />
     </Form>
     </div>
    </>
  )
}

export default EditarCliente