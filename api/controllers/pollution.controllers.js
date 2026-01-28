const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

// exports.get = (req, res) => {

//      Pollution.findAll()
//     .then(data => {res.send(data);})
//     .catch(err => {
//       res.status(400).send({
//         message: err.message
//       });
//     });

// };

// GET toutes les pollutions
exports.getAll = async (req, res) => {
    try {
        const pollutions = await Pollution.findAll();
        res.status(200).json(pollutions);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET pollution par ID
exports.getById = async (req, res) => {
    try {
        const pollution = await Pollution.findByPk(req.params.id);
        if (!pollution) return res.status(404).json({ message: "Pollution non trouvée" });
        res.status(200).json(pollution);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST créer une pollution
exports.create = async (req, res) => {
    try {
        // Récupérer l'utilisateur depuis le token JWT (ajouté par authenticateToken middleware)
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }


            // Créer la pollution en associant l'utilisateur connecté
            const newPollution = await Pollution.create({
                ...req.body,
                photo_url: photoUrlToInsert,
                user_id: userId // Assigner automatiquement l'utilisateur connecté
        });

        res.status(201).json(newPollution);
    } catch (err) {
        console.error('Erreur create pollution:', err);
        res.status(400).json({ message: err.message });
    }
};

// PUT mettre à jour une pollution
exports.update = async (req, res) => {
    try {
        const [updated] = await Pollution.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ message: "Pollution non trouvée" });
        const updatedPollution = await Pollution.findByPk(req.params.id);
        res.status(200).json(updatedPollution);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE supprimer une pollution
exports.delete = async (req, res) => {
    try {
        const deleted = await Pollution.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Pollution non trouvée" });
        res.status(200).json({ message: "Pollution supprimée" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST upload photo
exports.uploadPhoto = async (req, res) => {
    try {
        if (req.file) {
            console.log('Fichier reçu:', req.file.originalname, req.file.mimetype, req.file.size, 'octets');
        } else {
            console.error("Aucun fichier reçu lors de l'upload.");
            return res.status(400).json({ message: "Aucun fichier fourni" });
        }

        // Cloudinary retourne l'URL dans req.file.path
        const photoUrl = req.file.path;

        res.status(200).json({
            message: "Photo uploadée avec succès",
            url: photoUrl,
            cloudinary_id: req.file.filename
        });
    } catch (err) {
        console.error("Erreur lors de l'upload de la photo:", err);
        console.error("Erreur détaillée upload photo:", JSON.stringify(err, null, 2));
        // Ajoute le message d'erreur détaillé si disponible
        let errorMsg = err.message;
        if (err.error) {
            errorMsg += ' | ' + JSON.stringify(err.error);
        }
        res.status(500).json({ message: errorMsg, error: err });
    }
};