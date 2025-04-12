import { NumberInput, SegmentedControl, Alert, LoadingOverlay, Loader, Box, Group, Button, Stack, Title, Card, Input } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';


function App() {

    const [ambgynnavstevy, setAmbgynnavstevy] = useState<string | number>('');
    const [ambcelkemnavstevy, setAmbcelkemnavstevy] = useState<string | number>('');
    const [ambonknavstevy, setAmbonknavstevy] = useState<string | number>('');
    const [ambchirnavstevy, setAmbchirnavstevy] = useState<string | number>('');
    const [vekovakategorie, setVekovakategorie] = useState<string | undefined>('10');
    const [pldelka, setPldelka] = useState<string | number>('');
    const [ambintnavstevy, setAmbintnavstevy] = useState<string | number>('');
    const [plpocetleceb, setPlpocetleceb] = useState<string | number>('');
    const [jedispprakt, setJedispprakt] = useState<string | undefined>('ne');
    const [plpocetlecebC, setPlpocetlecebC] = useState<string | number>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const [recurrenceData, setRecurrenceData] = useState([]);

    const handleSubmit = async () => {
        const data = {
            ambgynnavstevy,
            ambcelkemnavstevy,
            ambonknavstevy,
            ambchirnavstevy,
            vekovakategorie,
            pldelka,
            ambintnavstevy,
            plpocetleceb,
            jedispprakt,
            plpocetlecebC
        }

        const url = "http://localhost:5000/predict";

        try {
            setLoading(true);
            const response = await fetch(
                url, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            setLoading(false);
            setError('');
            console.log(json);
        } catch (error: any) {
            setLoading(false);
            setError(error.message);
            console.error(error.message);
        }
    }

    return (
        <>
            <header>
                <Group justify="center" style={{padding: "2em"}}>
                    <Title>BCRP</Title>
                </Group>
            </header>
            <main>
                <Stack>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <LoadingOverlay visible={loading} loaderProps={{children: <Loader />}} />
                        <Box pos="relative">
                            <Stack gap="2em">
                                {error && <Alert variant="light" color="red" title="Error" icon={<IconInfoCircle />}>
                                    { error }
                                </Alert>}
                                <Group justify="space-between">
                                    <Group>
                                        <Input.Label>amb gyn navstevy</Input.Label>
                                        <NumberInput
                                            value={ambgynnavstevy}
                                            onChange={setAmbgynnavstevy}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>amb celkem navstevy</Input.Label>
                                        <NumberInput
                                            value={ambcelkemnavstevy}
                                            onChange={setAmbcelkemnavstevy}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>amb onk navstevy</Input.Label>
                                        <NumberInput
                                            value={ambonknavstevy}
                                            onChange={setAmbonknavstevy}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>amb chir navstevy</Input.Label>
                                        <NumberInput
                                            value={ambchirnavstevy}
                                            onChange={setAmbchirnavstevy}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>vekova kategorie</Input.Label>
                                        <SegmentedControl
                                            value={vekovakategorie}
                                            data={[
                                                {value: '2', label: '20-29'},
                                                {value: '3', label: '30-39'},
                                                {value: '4', label: '40-49'},
                                                {value: '5', label: '50-59'},
                                                {value: '6', label: '60-69'},
                                                {value: '7', label: '70-79'},
                                                {value: '8', label: '80-89'},
                                                {value: '9', label: '90-99'}
                                            ]}
                                            onChange={setVekovakategorie}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>pl delka</Input.Label>
                                        <NumberInput
                                            value={pldelka}
                                            onChange={setPldelka}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>amb int navstevy</Input.Label>
                                        <NumberInput
                                            value={ambintnavstevy}
                                            onChange={setAmbintnavstevy}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>pl pocet leceb</Input.Label>
                                        <NumberInput
                                            value={plpocetleceb}
                                            onChange={setPlpocetleceb}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>je disp prakt</Input.Label>
                                        <SegmentedControl
                                            value={jedispprakt}
                                            data={[
                                                {value: '0', label: 'ne'},
                                                {value: '1', label: 'ano'},
                                            ]}
                                            onChange={setJedispprakt}
                                        />
                                    </Group>
                                    <Group>
                                        <Input.Label>pl pocet leceb c</Input.Label>
                                        <NumberInput
                                            value={plpocetlecebC}
                                            onChange={setPlpocetlecebC}
                                        />
                                    </Group>

                                </Group>
                                <Group justify="center">
                                    <Button onClick={handleSubmit}>Vyhodnotit</Button>
                                </Group>
                            </Stack>
                        </Box>
                        <Stack>
                            <Group>
                                <LineChart width={500} height={300} data={recurrenceData}>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                                    <Line type="monotone" dataKey="y" stroke="red" />
                                </LineChart>
                            </Group>
                        </Stack>
                    </Card>
                </Stack>
            </main>
        </>
    )
}

export default App
