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
import { allPlayersBySport } from '../../../App/Common/Form/Options/playerOptions';
import MyDateInput from './MyDateInput';
import { ActivityFormValues } from '../../../App/models/activity';
import { DropdownProps } from 'semantic-ui-react';
import { MySelectOption } from '../../../App/Common/Types/MySelectTypes';

const defaultPlayerOptions: MySelectOption[] = [
    { key: 'none', text: 'Please select a category first', value: '' }
];


export default observer(function ActivityForm(){
    const history = useHistory();
    const {activityStore} = useStore();
    const { createActivity, updateActivity, loadActivity, loadingInitial} = activityStore
    const {id} = useParams<{id: string}>();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
    const [dynamicPlayerOptions, setDynamicPlayerOptions] = useState<MySelectOption[]>(allPlayersBySport['default']);

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        numberOfPlayers: Yup.string().required('Number of players required'),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    })

    useEffect(() => {
        if (id) {
            loadActivity(id).then(loadedActivity => {
                const activityFormValues = new ActivityFormValues(loadedActivity);
                setActivity(activityFormValues);

                // Update dynamicPlayerOptions based on the loaded activity's category
                if (activityFormValues.category && allPlayersBySport[activityFormValues.category]) {
                    setDynamicPlayerOptions(allPlayersBySport[activityFormValues.category]);
                } else {
                    setDynamicPlayerOptions(defaultPlayerOptions);
                }
            });
        }
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
                {({handleSubmit, isValid, isSubmitting, dirty, setFieldValue, setFieldTouched, values}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name = 'title' placeholder='Title'/>
                        <MyTextArea rows={3} placeholder='Description' name='description'/>
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category'
                        onChange={
                            (e, data: DropdownProps) => {
                                const selectedCategory = data.value as string;
                                setFieldValue('category', selectedCategory); // Update Formik's category value

                                // Reset players field value when category changes
                                setFieldValue('players', '');
                                setFieldTouched('players', false); // Optional: Mark players as untouched to clear validation errors immediately

                                // Update the options for the players select based on the selected category
                                if (selectedCategory && allPlayersBySport[selectedCategory]) {
                                    setDynamicPlayerOptions(allPlayersBySport[selectedCategory]);
                                    //setFieldValue('players', activity.numberOfPlayers?.toString())
                                } else {
                                    setDynamicPlayerOptions(defaultPlayerOptions);
                                }
                            }
                        }/>
                        <MyDateInput 
                            placeholderText='Date' 
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <MySelectInput
                            name='numberOfPlayers'
                            placeholder='Number of Players'
                            options={dynamicPlayerOptions}
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