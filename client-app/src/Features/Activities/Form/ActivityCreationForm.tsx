import { useState } from "react";
import FootballActivityForm from "./ActivitySubTypes/FootballActivityForm";
import { Segment, Select } from "semantic-ui-react";
import MySelectInput from "./MySelectInput";
import { MySelectOption } from "../../../App/Common/Types/MySelectTypes";
import { Formik } from "formik";

const ActivityCreationPage = () => {
  const [selectedType, setSelectedType] = useState('none');

  const ActivityOptions: MySelectOption[] = [
      { key: 'none', text: 'Please select a category first', value: '' },
      { key: 'football', text: 'Football', value: 'football' }
  ];
  const [activityOptions, setActivityOptions] = useState<MySelectOption[]>(ActivityOptions);

  const renderForm = () => {
    if (selectedType === 'football') {
      return <FootballActivityForm />;
    }
    // ... add more activity types
    return null;
  };

  return (
    <Segment clearing>
      <div>
      <Select
                clearable
                placeholder="Select Activity Type"
                options={ActivityOptions}
                value={undefined}
                onChange={(e,data) => setSelectedType(data.value as string)}
            />
        {renderForm()}
      </div>
    </Segment>
  );
};

export default ActivityCreationPage;