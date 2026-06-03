import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface AddAddressModalProps {
    onAddAddress?: (address: {
        street: string;
        city: string;
        postal_code: string;
        country: string;
        name?: string;
    }) => void;
}

export default function AddAddressModal({ onAddAddress }: AddAddressModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        postal_code: '',
        country: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.street.trim()) {
            newErrors.street = 'L\'adresse est requise';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'La ville est requise';
        }
        if (!formData.postal_code.trim()) {
            newErrors.postal_code = 'Le code postal est requis';
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Le pays est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(route('tenant.addresses.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de l\'adresse');
            }

            const newAddress = await response.json();

            if (onAddAddress) {
                onAddAddress(newAddress);
            }

            toast.success('Adresse ajoutée avec succès');
            setIsOpen(false);
            setFormData({
                name: '',
                street: '',
                city: '',
                postal_code: '',
                country: '',
            });
        } catch (error) {
            toast.error('Erreur lors de l\'ajout de l\'adresse');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={setIsOpen}>
            <ModalTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter une adresse
                </Button>
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Ajouter une nouvelle adresse</ModalTitle>
                </ModalHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom (optionnel)</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Domicile, Bureau"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <Label htmlFor="street">Adresse *</Label>
                        <Input
                            id="street"
                            placeholder="123 rue de la Paix"
                            value={formData.street}
                            onChange={(e) =>
                                setFormData({ ...formData, street: e.target.value })
                            }
                            className={errors.street ? 'border-red-500' : ''}
                        />
                        {errors.street && (
                            <p className="text-sm text-red-500 mt-1">{errors.street}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city">Ville *</Label>
                            <Input
                                id="city"
                                placeholder="Dakar"
                                value={formData.city}
                                onChange={(e) =>
                                    setFormData({ ...formData, city: e.target.value })
                                }
                                className={errors.city ? 'border-red-500' : ''}
                            />
                            {errors.city && (
                                <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="postal_code">Code postal *</Label>
                            <Input
                                id="postal_code"
                                placeholder="12345"
                                value={formData.postal_code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        postal_code: e.target.value,
                                    })
                                }
                                className={errors.postal_code ? 'border-red-500' : ''}
                            />
                            {errors.postal_code && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.postal_code}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="country">Pays *</Label>
                        <Input
                            id="country"
                            placeholder="Sénégal"
                            value={formData.country}
                            onChange={(e) =>
                                setFormData({ ...formData, country: e.target.value })
                            }
                            className={errors.country ? 'border-red-500' : ''}
                        />
                        {errors.country && (
                            <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Ajout...' : 'Ajouter'}
                        </Button>
                    </div>
                </form>
            </ModalContent>
        </Modal>
    );
}
