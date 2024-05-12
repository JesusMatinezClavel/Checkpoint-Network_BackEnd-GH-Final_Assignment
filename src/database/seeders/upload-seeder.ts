// Models
import { User } from "../../entities/user/User";
import { Upload } from "../../entities/upload/Upload";
import fs from "fs";
import path from "path";

const __fileName = __filename
const __filePath = path.dirname(__fileName)

export const seedControlUploads = async () => {

    const users = await User.find()

    const modelsNames = [
        'Ammunition_Box01.fbx',
        'Ammunition_Box02.fbx',
        'Ammunition_Box03.fbx',
        'Cannon_Lp.fbx',
        'Casa de las conchas.fbx',
        'Cash_Machine.fbx',
        'cube.fbx',
        'DE_PDA.fbx',
        'EE - 3.fbx',
        'Flash_Grenade.fbx',
        'Impact_Detonator.fbx',
        'Ion_Grenade.fbx',
        'Lightsaber_Darksaber.fbx',
        'MiniKashba.fbx',
        'Old_Camera.fbx',
        'PirateAssets.fbx',
        'Repair_Robot.fbx',
        'Samurai.fbx',
        'servofist.fbx',
        'MuroLadrillos.fbx'
    ]

    const modelsPath = [
        path.join(__dirname, '../../../', 'seeder-files/Ammunition_Box01.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Ammunition_Box02.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Ammunition_Box03.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Cannon_Lp.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Casa de las conchas.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Cash_Machine.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/cube.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/DE_PDA.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/EE-3.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Flash_Grenade.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Impact_Detonator.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Ion_Grenade.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Lightsaber_Darksaber.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/MiniKashba.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/MuroLadrillos.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Old_Camera.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/PirateAssets.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Repair_Robot.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Samurai.fbx'),
        path.join(__dirname, '../../../', 'seeder-files/Servofist.fbx'),
    ]
    users.map(async (user, index) => {
        const userFolder = path.join(__dirname, '../../../', '3D-Models', user?.name);
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        const destinationPath = path.join(userFolder, modelsNames[index]);
        fs.copyFileSync(modelsPath[index], destinationPath);

        const model = new Upload();
        model.name = modelsNames[index];
        model.description = `basic ${modelsNames[index].split(".")[0]} model to share`;
        model.user = { id: user.id } as User;
        model.liked = [{ id: user.id } as User];
        model.createdAt = new Date();
        model.updatedAt = new Date();

        const randomLikesCount = Math.floor(Math.random() * users?.length);
        const randomUsers = users.sort(() => 0.5 - Math.random()).slice(0, randomLikesCount);
        model.liked = randomUsers;

        await Upload.save(model);

        for (const likedUser of randomUsers) {
            const updateUser = await User.findOne({
                where: { id: likedUser.id },
                relations: ['likes']
            });
            if (updateUser) {
                const alreadyLiked = updateUser.likes.some(like => like.id === model.id);
                if (!alreadyLiked) {
                    updateUser.likes = [...updateUser.likes, model];
                    await User.save(updateUser);
                }
            }
        }
    });
    // for (const user of users) {


    //     const userFolder = path.join(__dirname, '../../../', '3D-Models', user.name)
    //     if (!fs.existsSync(userFolder)) {
    //         fs.mkdirSync(userFolder, { recursive: true })
    //     }

    //     const destinationPath = path.join(userFolder, 'cube.fbx');
    //     fs.copyFileSync(cubePath, destinationPath);

    //     const cube = new Upload();
    //     cube.name = `cube.fbx`;
    //     cube.description = 'basic cube with beveled vertices';
    //     cube.user = { id: user.id } as User;
    //     cube.liked = [{ id: user.id } as User];
    //     cube.createdAt = new Date();
    //     cube.updatedAt = new Date();

    //     await Upload.save(cube);

    //     const updateUser = await User.findOne({
    //         where: { id: user.id },
    //         relations: ['likes']
    //     });

    //     if (updateUser) {
    //         updateUser.likes = [...updateUser.likes, cube];
    //         await User.save(updateUser);
    //     }
    // }


    console.log('------------------------');
    console.log('Control uploads created!');
    console.log("--- User's likes updated");
    console.log('------------------------');

}
