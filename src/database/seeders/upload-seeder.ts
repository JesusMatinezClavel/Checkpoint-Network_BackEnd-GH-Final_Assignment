// Models
import { User } from "../../entities/user/User";
import { Upload } from "../../entities/upload/Upload";
import fs from "fs";
import path from "path";

const __fileName = __filename
const __filePath = path.dirname(__fileName)

export const seedControlUploads = async () => {

    const users = await User.find()

    for (const user of users) {

        const filePath = path.join(__dirname, '../../../', '3D-Models/Seeders', `cube.fbx`)

        // const cube = new Upload()
        // cube.name = `${user.name}-cube.fbx`
        // const fileBuffer = fs.readFileSync(cubePath)

        fs.readFile(filePath, async (err: NodeJS.ErrnoException | null, fileBuffer: Buffer) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }

            const cube = new Upload();
            cube.name = `${user.name}-cube.fbx`;
            cube.file = fileBuffer; 
            cube.description = 'basic cube with beveled vertices';
            cube.user = { id: user.id } as User;
            cube.liked = [{ id: user.id } as User];
            cube.createdAt = new Date();
            cube.updatedAt = new Date();

            await Upload.save(cube);

            const updateUser = await User.findOne({
                where: { id: user.id },
                relations: ['likes']
            });

            if (updateUser) {
                updateUser.likes = [...updateUser.likes, cube];
                await User.save(updateUser);
            }
        });

        // const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });
        // const blobUrl = URL.createObjectURL(blob);

        //     cube.file = fileBuffer
        //     cube.description = 'basic cube with beveled vertices'
        //     cube.user = {
        //         id: user.id
        //     } as User
        //     cube.liked = [{
        //         id: user.id
        //     } as User]
        //     cube.createdAt = new Date()
        //     cube.updatedAt = new Date()
        //     await Upload.save(cube)

        //     const updateUser = await User.findOne({
        //         where: {
        //             id: user.id
        //         },
        //         relations: [
        //             'likes'
        //         ]
        //     })
        //     updateUser!.likes = [...[cube]]
        //     await User.save(updateUser!)
        // }

        console.log('------------------------');
        console.log('Control uploads created!');
        console.log("--- User's likes updated");
        console.log('------------------------');

    }
}