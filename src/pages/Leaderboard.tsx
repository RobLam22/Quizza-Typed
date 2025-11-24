import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import { useState, useEffect } from 'react';
import supabase from '../utils/supabase-client';
import { categories } from '../utils/categories';

type Stat = {
    score: string;
    first_name: string;
    difficulty: string;
    category: string;
};

export default function Leaderboard() {
    const [stats5, setStats5] = useState<Stat[] | null>([]);
    const [stats10, setStats10] = useState<Stat[] | null>([]);

    useEffect(() => {
        async function fetchLeaderboard5(): Promise<void> {
            const res = await supabase
                .from('leaderboard5')
                .select(`first_name, category, difficulty, score`)
                .order('score', { ascending: false })
                .limit(20);
            setStats5(res.data);
        }
        fetchLeaderboard5();
        async function fetchLeaderboard10(): Promise<void> {
            const res = await supabase
                .from('leaderboard10')
                .select(`first_name, category, difficulty, score`)
                .order('score', { ascending: false })
                .limit(20);
            setStats10(res.data);
        }
        fetchLeaderboard10();
    }, []);

    const leaderboard5Data = stats5
        ? stats5.map((stat: Stat) => (
              <TableRow>
                  <TableCell>{stat.score}</TableCell>
                  <TableCell>{stat.first_name}</TableCell>
                  <TableCell>{`${stat.difficulty[0].toUpperCase()}${stat.difficulty.slice(1)}`}</TableCell>
                  <TableCell>
                      {' '}
                      {categories.find(
                          (category) => category.id === Number(stat.category)
                      )?.name || 'Unknown'}
                  </TableCell>
              </TableRow>
          ))
        : null;

    const leaderboard10Data = stats10
        ? stats10.map((stat: Stat) => (
              <TableRow>
                  <TableCell>{stat.score}</TableCell>
                  <TableCell>{stat.first_name}</TableCell>
                  <TableCell>{`${stat.difficulty[0].toUpperCase()}${stat.difficulty.slice(1)}`}</TableCell>
                  <TableCell>
                      {' '}
                      {categories.find(
                          (category) => category.id === Number(stat.category)
                      )?.name || 'Unknown'}
                  </TableCell>
              </TableRow>
          ))
        : null;
    return (
        <>
            <Table className="w-140 mx-auto lg:w-306 lg:mt-12">
                <TableCaption>5 Question Quiz Leaderboard</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Score</TableHead>
                        <TableHead className="w-[100px]">Player Name</TableHead>
                        <TableHead className="w-[100px]">Difficulty</TableHead>
                        <TableHead className="w-[100px]">Category</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>{leaderboard5Data}</TableBody>
            </Table>
            <Table className="w-140 mx-auto lg:w-306 lg:mt-12">
                <TableCaption>10 Question Quiz Leaderboard</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Score</TableHead>
                        <TableHead className="w-[100px]">Player Name</TableHead>
                        <TableHead className="w-[100px]">Difficulty</TableHead>
                        <TableHead className="w-[100px]">Category</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>{leaderboard10Data}</TableBody>
            </Table>
        </>
    );
}
