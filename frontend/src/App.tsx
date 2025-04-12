import { NumberInput, SegmentedControl, Alert, LoadingOverlay, Loader, Box, Group, Button, Stack, Title, Card, Input } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';


function App() {

    const [ambgynnavstevy, setAmbgynnavstevy] = useState<string | number>('');
    const [ambcelkemnavstevy, setAmbcelkemnavstevy] = useState<string | number>('');
    const [ambonknavstevy, setAmbonknavstevy] = useState<string | number>('');
    const [ambchirnavstevy, setAmbchirnavstevy] = useState<string | number>('');
    const [vekovakategorie, setVekovakategorie] = useState<string | undefined>('');
    const [pldelka, setPldelka] = useState<string | number>('');
    const [ambintnavstevy, setAmbintnavstevy] = useState<string | number>('');
    const [plpocetleceb, setPlpocetleceb] = useState<string | number>('');
    const [jedispprakt, setJedispprakt] = useState<string | undefined>('ne');
    const [plpocetlecebC, setPlpocetlecebC] = useState<string | number>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const [recurrenceData, setRecurrenceData] = useState([]);

    const handleAgeChange = (value: number) => {
        setVekovakategorie(value - (value % 10) / 10);
    }

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
                                <Group>
                                    <Stack justify="space-between">
                                        <Group justify="space-between">
                                            <Input.Label>amb gyn navstevy</Input.Label>
                                            <NumberInput
                                                value={ambgynnavstevy}
                                                onChange={setAmbgynnavstevy}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>amb celkem navstevy</Input.Label>
                                            <NumberInput
                                                value={ambcelkemnavstevy}
                                                onChange={setAmbcelkemnavstevy}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>amb onk navstevy</Input.Label>
                                            <NumberInput
                                                value={ambonknavstevy}
                                                onChange={setAmbonknavstevy}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>amb chir navstevy</Input.Label>
                                            <NumberInput
                                                value={ambchirnavstevy}
                                                onChange={setAmbchirnavstevy}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>vek</Input.Label>
                                            <NumberInput
                                                value={vekovakategorie}
                                                onChange={handleAgeChange}
                                            />
                                        </Group>
                                    </Stack>
                                    <Stack justify="space-between">
                                        <Group justify="space-between">
                                            <Input.Label>pl delka</Input.Label>
                                            <NumberInput
                                                value={pldelka}
                                                onChange={setPldelka}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>amb int navstevy</Input.Label>
                                            <NumberInput
                                                value={ambintnavstevy}
                                                onChange={setAmbintnavstevy}
                                            />
                                        </Group>
                                        <Group justify="space-between">
                                            <Input.Label>pl pocet leceb</Input.Label>
                                            <NumberInput
                                                value={plpocetleceb}
                                                onChange={setPlpocetleceb}
                                            />
                                        </Group>
                                        <Group justify="space-between">
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
                                        <Group justify="space-between">
                                            <Input.Label>pl pocet leceb c</Input.Label>
                                            <NumberInput
                                                value={plpocetlecebC}
                                                onChange={setPlpocetlecebC}
                                            />
                                        </Group>
                                    </Stack>
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
