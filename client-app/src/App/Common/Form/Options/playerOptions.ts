import { MySelectOption } from '../../../Common/Types/MySelectTypes';

export const allPlayersBySport: { [key: string]: MySelectOption[] } = {
    football: [
        { key: '10', text: '10', value: 10 },
        { key: '12', text: '12', value: 12 },
        { key: '14', text: '14', value: 14 },
        { key: '16', text: '16', value: 16 },
        { key: '18', text: '18', value: 18 },
        { key: '20', text: '20', value: 20 },
        { key: '22', text: '22', value: 22 },
    ],
    basketball: [
        { key: '2', text: '2', value: 2 },
        { key: '4', text: '4', value: 4 },
        { key: '6', text: '6', value: 6 },
        { key: '8', text: '8', value: 8 },
        { key: '10', text: '10', value: 10 },
    ],
    tennis: [
        { key: '2', text: '2', value: 2 },
        { key: '4', text: '4', value: 4 },
    ],
    padel: [
        { key: '2', text: '2', value: 2 },
        { key: '4', text: '4', value: 4 },
    ],
    golf: [
        { key: '1', text: '1', value: 1 },
        { key: '2', text: '2', value: 2 },
        { key: '3', text: '3', value: 3 },
        { key: '4', text: '4', value: 4 },
    ],
    rugby: [
        { key: '14', text: '14', value: 14 },
        { key: '16', text: '16', value: 16 },
        { key: '18', text: '18', value: 18 },
        { key: '20', text: '20', value: 20 },
        { key: '22', text: '22', value: 22 },
    ],
    default: [
        {key: '', text: '', value: 0}
    ]
    // Add other categories and their players as needed
};