import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponents';
import { useStore } from '../../../App/Stores/store';
import {v4 as uuid} from 'uuid';
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../App/Common/Form/MyTextInput';
import MyTextArea from './MyTextArea';
import MySelectInput from './MySelectInput';
import { categoryOptions } from '../../../App/Common/Form/Options/categoryOptions';
import MyDateInput from './MyDateInput';
import { ActivityFormValues } from '../../../App/models/activity';


export default observer(function ActivityForm(){
    const history = useHistory();
    const {activityStore} = useStore();
    const { createActivity, updateActivity, loadActivity, loadingInitial} = activityStore
    const {id} = useParams<{id: string}>();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    }, [id, loadActivity]);



    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }


    if (loadingInitial) return <LoadingComponent content='Loading activity...'/>

    return(
        <Segment clearing>
            <Header content='Activity Details' sub color='teal'/>
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name = 'title' placeholder='Title'/>
                        <MyTextArea rows={3} placeholder='Description' name='description'/>
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category'/>
                        <MyDateInput 
                            placeholderText='Date' 
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal'/>
                        <MyTextInput placeholder='City' name='city'/>
                        <MyTextInput placeholder='Venue' name='venue'/>
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
            
        </Segment>
    )
})